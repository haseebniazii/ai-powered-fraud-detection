// =========================================================
// FastAPI Configuration
// =========================================================

const API_URL = "http://127.0.0.1:8000";


// =========================================================
// DOM Elements
// =========================================================

const fraudForm = document.getElementById("fraudForm");

const predictBtn = document.getElementById("predictBtn");

const btnText = document.getElementById("btnText");

const apiStatus = document.getElementById("apiStatus");

const resultPlaceholder =
    document.getElementById("resultPlaceholder");

const resultContent =
    document.getElementById("resultContent");

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");

const retryBtn =
    document.getElementById("retryBtn");

const resetBtn =
    document.getElementById("resetBtn");

const resultBadge =
    document.getElementById("resultBadge");

const resultIcon =
    document.getElementById("resultIcon");

const resultText =
    document.getElementById("resultText");

const fraudProbability =
    document.getElementById("fraudProbability");

const fraudProbabilitySmall =
    document.getElementById("fraudProbabilitySmall");

const legitimateProbability =
    document.getElementById("legitimateProbability");

const progressFill =
    document.getElementById("progressFill");

const resultMessage =
    document.getElementById("resultMessage");


// =========================================================
// Helper: Get Number
// =========================================================

function getNumber(id) {

    const value = Number(
        document.getElementById(id).value
    );

    return value;
}


// =========================================================
// Helper: Get Text
// =========================================================

function getText(id) {

    return document
        .getElementById(id)
        .value
        .trim();
}


// =========================================================
// Helper: Get Toggle
// =========================================================

function getToggle(id) {

    return document
        .getElementById(id)
        .checked ? 1 : 0;
}


// =========================================================
// Check API
// =========================================================

async function checkAPI() {

    try {

        const response = await fetch(
            `${API_URL}/health`
        );

        if (!response.ok) {
            throw new Error("API is not responding.");
        }

        const data = await response.json();

        if (data.status === "healthy") {

            apiStatus.textContent = "API Connected";

        } else {

            apiStatus.textContent = "API Ready";
        }

    } catch (error) {

        apiStatus.textContent = "API Offline";

        console.warn(
            "FastAPI connection failed:",
            error.message
        );
    }
}


// =========================================================
// Create Transaction Object
// =========================================================

function getTransactionData() {

    const transactionAmount =
        getNumber("transaction_amount");

    const averageAmount =
        getNumber("avg_transaction_amount_30d");


    // Prevent division by zero
    if (averageAmount <= 0) {

        throw new Error(
            "30-day average transaction amount must be greater than 0."
        );
    }


    // Feature engineering
    const amountRatio =
        transactionAmount / averageAmount;


    return {

        transaction_hour:
            getNumber("transaction_hour"),

        account_age_days:
            getNumber("account_age_days"),

        previous_chargebacks:
            getNumber("previous_chargebacks"),

        merchant_category:
            getText("merchant_category"),

        transaction_country:
            getText("transaction_country"),

        device_type:
            document.getElementById("device_type").value,

        is_international:
            getToggle("is_international"),

        is_high_risk_merchant:
            getToggle("is_high_risk_merchant"),

        transaction_amount:
            transactionAmount,

        transaction_velocity_1h:
            getNumber("transaction_velocity_1h"),

        transaction_velocity_24h:
            getNumber("transaction_velocity_24h"),

        avg_transaction_amount_30d:
            averageAmount,

        amount_ratio:
            amountRatio
    };
}


// =========================================================
// Validate Data
// =========================================================

function validateTransaction(data) {

    if (
        data.transaction_hour < 0 ||
        data.transaction_hour > 23
    ) {

        throw new Error(
            "Transaction hour must be between 0 and 23."
        );
    }


    if (data.account_age_days < 0) {

        throw new Error(
            "Account age cannot be negative."
        );
    }


    if (data.previous_chargebacks < 0) {

        throw new Error(
            "Previous chargebacks cannot be negative."
        );
    }


    if (data.transaction_amount < 0) {

        throw new Error(
            "Transaction amount cannot be negative."
        );
    }


    if (data.transaction_velocity_1h < 0) {

        throw new Error(
            "1-hour transaction velocity cannot be negative."
        );
    }


    if (data.transaction_velocity_24h < 0) {

        throw new Error(
            "24-hour transaction velocity cannot be negative."
        );
    }


    if (data.avg_transaction_amount_30d <= 0) {

        throw new Error(
            "30-day average amount must be greater than 0."
        );
    }


    if (!data.merchant_category) {

        throw new Error(
            "Please enter a merchant category."
        );
    }


    if (!data.transaction_country) {

        throw new Error(
            "Please enter a transaction country."
        );
    }
}


// =========================================================
// Show Loading
// =========================================================

function setLoading(isLoading) {

    predictBtn.disabled = isLoading;


    if (isLoading) {

        btnText.textContent =
            "Analyzing Transaction...";

    } else {

        btnText.textContent =
            "Analyze Transaction";
    }
}


// =========================================================
// Show Error
// =========================================================

function showError(message) {

    resultPlaceholder.classList.add("hidden");

    resultContent.classList.add("hidden");

    errorBox.classList.remove("hidden");

    errorMessage.textContent = message;
}


// =========================================================
// Show Result
// =========================================================

function showResult(data) {

    resultPlaceholder.classList.add("hidden");

    errorBox.classList.add("hidden");

    resultContent.classList.remove("hidden");


    // Convert decimal probability to percentage
    const fraudPercent =
        Number(data.fraud_probability) * 100;

    const legitimatePercent =
        Number(data.legitimate_probability) * 100;


    // Display percentages
    fraudProbability.textContent =
        `${fraudPercent.toFixed(2)}%`;

    fraudProbabilitySmall.textContent =
        `${fraudPercent.toFixed(2)}%`;

    legitimateProbability.textContent =
        `${legitimatePercent.toFixed(2)}%`;


    // Progress bar
    progressFill.style.width =
        `${Math.min(fraudPercent, 100)}%`;


    // Result
    if (data.prediction === "Fraud") {

        resultBadge.className =
            "result-badge fraud";

        resultIcon.textContent = "!";

        resultText.textContent =
            "FRAUD DETECTED";

        progressFill.style.background =
            "var(--red)";

        resultMessage.textContent =
            `The model classified this transaction as potentially fraudulent with a fraud probability of ${fraudPercent.toFixed(2)}%.`;

    } else {

        resultBadge.className =
            "result-badge legitimate";

        resultIcon.textContent = "✓";

        resultText.textContent =
            "LEGITIMATE";

        progressFill.style.background =
            "var(--green)";

        resultMessage.textContent =
            `The model classified this transaction as legitimate with a fraud probability of ${fraudPercent.toFixed(2)}%.`;
    }
}


// =========================================================
// Send Prediction Request
// =========================================================

async function predictTransaction(data) {

    const response = await fetch(
        `${API_URL}/predict`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify(data)
        }
    );


    // FastAPI validation error
    if (response.status === 422) {

        const errorData =
            await response.json();

        throw new Error(
            "Invalid transaction data. Please check the input fields."
        );
    }


    // Other API errors
    if (!response.ok) {

        let message =
            "FastAPI returned an error.";

        try {

            const errorData =
                await response.json();

            if (errorData.detail) {
                message =
                    typeof errorData.detail === "string"
                        ? errorData.detail
                        : "Invalid request data.";
            }

        } catch (error) {
            // Ignore JSON parsing error
        }

        throw new Error(message);
    }


    return await response.json();
}


// =========================================================
// Form Submit
// =========================================================

fraudForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        try {

            setLoading(true);


            const transactionData =
                getTransactionData();


            validateTransaction(
                transactionData
            );


            const result =
                await predictTransaction(
                    transactionData
                );


            showResult(result);


        } catch (error) {

            console.error(error);

            showError(
                error.message ||
                "Unable to connect to the fraud detection API."
            );

        } finally {

            setLoading(false);
        }
    }
);


// =========================================================
// Reset
// =========================================================

function resetResult() {

    resultContent.classList.add("hidden");

    errorBox.classList.add("hidden");

    resultPlaceholder.classList.remove("hidden");

    progressFill.style.width = "0%";
}


resetBtn.addEventListener(
    "click",
    resetResult
);


retryBtn.addEventListener(
    "click",
    resetResult
);


// =========================================================
// API Status Check
// =========================================================

checkAPI();


// Check every 10 seconds
setInterval(
    checkAPI,
    10000
);