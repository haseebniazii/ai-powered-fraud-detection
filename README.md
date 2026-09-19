# 🛡️ AI Powered Fraud Detection

<p align="center">
  🚀 Machine Learning | 📊 Binary Classification | 🤖 Gradient Boosting | 💳 Fraud Detection | ⚡ FastAPI
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python">
  <img src="https://img.shields.io/badge/Pandas-Data%20Analysis-150458?style=for-the-badge&logo=pandas">
  <img src="https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-orange?style=for-the-badge&logo=scikit-learn">
  <img src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi">
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge">
</p>

---

## 🌐 Live Demo

### 🛡️ Live Web Application

👉 **[Open AI Powered Fraud Detection](https://haseebniazii.github.io/ai-powered-fraud-detection/)**

Enter financial transaction details and get a Machine Learning prediction:

* ✅ Legitimate
* 🚨 Fraud

### ⚡ Live FastAPI Backend

👉 **[Open FastAPI API](https://ai-powered-fraud-detection.fastapicloud.dev/)**

### 📚 API Documentation

👉 **[Open Swagger API Docs](https://ai-powered-fraud-detection.fastapicloud.dev/docs)**

The Swagger interface allows you to test the `/predict` endpoint directly.

---

# 📌 About The Project

**AI Powered Fraud Detection** is an end-to-end Machine Learning project designed to classify financial transactions as either **legitimate or fraudulent**.

The project demonstrates a complete Machine Learning workflow, starting from data exploration and cleaning and continuing through feature engineering, preprocessing, model comparison, cross-validation, model evaluation, model serialization, FastAPI development, deployment, and frontend integration.

The final Machine Learning pipeline is integrated with a FastAPI backend to provide real-time predictions through an API.

---

# 🎯 Project Objective

The main objective of this project is to build a Machine Learning classification system that can identify potentially fraudulent financial transactions using transaction and customer-related information.

The model predicts two classes:

```text
0 → Legitimate
1 → Fraud
```

The system uses transaction characteristics such as:

* Transaction hour
* Account age
* Previous chargebacks
* Merchant category
* Transaction country
* Device type
* International transaction status
* High-risk merchant status
* Transaction amount
* Transaction velocity
* Average transaction amount

---

# 📊 Dataset

The project uses a financial transaction dataset containing **5,300 transaction records** and **15 columns** before duplicate removal.

The dataset contains:

* Legitimate transactions
* Fraudulent transactions
* Numerical transaction features
* Categorical transaction features
* Binary risk indicators

### Target Variable

```text
risk_label
```

### Target Classes

```text
0 → Legitimate
1 → Fraud
```

The original dataset contained approximately:

```text
Legitimate → 4,773
Fraud      → 527
```

The dataset therefore contains class imbalance, with legitimate transactions representing the majority class.

---

# 🔎 Exploratory Data Analysis

Exploratory Data Analysis was performed to understand the structure and quality of the transaction data.

### EDA Performed

* Dataset shape and structure
* Data types
* Missing-value analysis
* Duplicate analysis
* Target distribution
* Summary statistics
* Numerical feature analysis
* Categorical feature analysis
* Fraud pattern inspection
* Outlier analysis
* Feature relationships

EDA helped identify data-quality issues and potential patterns associated with fraudulent transactions.

---

# 🧹 Data Cleaning

Several data-cleaning steps were performed before Machine Learning.

### Duplicate Removal

The original dataset contained **300 duplicate rows**.

After removing duplicates, the modeling dataset contained approximately:

```text
5,000 records
```

### Invalid Values

Negative values were identified in features where negative values were not meaningful, including:

* Transaction hour
* Account age
* Transaction amount
* Average transaction amount

These invalid values were converted to missing values and handled later during preprocessing.

### ID Removal

The following identifiers were removed from the Machine Learning features:

```text
transaction_id
customer_id
```

These identifiers were not used as predictive features.

---

# ⚙️ Feature Engineering

A new feature called:

```text
amount_ratio
```

was created.

It represents the relationship between the current transaction amount and the customer's recent average transaction amount.

```text
amount_ratio =
transaction_amount /
avg_transaction_amount_30d
```

For example:

```text
Transaction amount = $800
Average 30-day amount = $200

amount_ratio = 4
```

This feature provides additional information about how unusual the current transaction amount is compared with the recent average.

---

# 🧠 Machine Learning Features

### Numerical Features

```text
transaction_hour
account_age_days
previous_chargebacks
transaction_amount
transaction_velocity_1h
transaction_velocity_24h
avg_transaction_amount_30d
amount_ratio
```

### Categorical Features

```text
merchant_category
transaction_country
device_type
```

### Binary Features

```text
is_international
is_high_risk_merchant
```

---

# 🔀 Train/Test Split

The dataset was divided into training and testing sets using an **80/20 split**.

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
```

### Split

```text
Training Data → 80%
Testing Data  → 20%
```

`stratify=y` was used to preserve the class distribution between the training and testing sets.

---

# ⚙️ Machine Learning Pipeline

The project uses Scikit-Learn's:

* `Pipeline`
* `ColumnTransformer`
* `SimpleImputer`
* `StandardScaler`
* `OneHotEncoder`

The preprocessing pipeline automatically handles different feature types.

```text
Raw Transaction Data
        ↓
Missing Value Handling
        ↓
Numerical Scaling
        ↓
Categorical Encoding
        ↓
ColumnTransformer
        ↓
Machine Learning Model
        ↓
Prediction
```

### Numerical Processing

```text
Median Imputation
        ↓
StandardScaler
```

### Categorical Processing

```text
Most Frequent Imputation
        ↓
One-Hot Encoding
```

### Binary Features

Binary features are passed directly to the model.

Using a complete pipeline ensures that the same preprocessing steps are applied during training and prediction.

---

# ⚖️ Class Imbalance

The dataset contains significantly more legitimate transactions than fraudulent transactions.

To address this during model comparison, class balancing was used for models that support the `class_weight` parameter.

This helps give greater consideration to the minority fraud class during training.

---

# 🤖 Models Compared

Four classification algorithms were evaluated.

## 1. Logistic Regression

Used as a baseline classification model.

```text
Accuracy → 0.884
Macro F1  → 0.774
```

---

## 2. Decision Tree

A non-linear classification algorithm capable of learning decision rules from the transaction data.

```text
Accuracy → 0.935
Macro F1  → 0.808
```

---

## 3. Random Forest

An ensemble model consisting of multiple decision trees.

```text
Accuracy → 0.947
Macro F1  → 0.861
```

---

## 4. Gradient Boosting

A sequential ensemble learning algorithm that builds models iteratively to improve predictions.

```text
Accuracy → 0.956
Macro F1  → 0.873
```

These results were obtained using **3-fold cross-validation on the training data**.

---

# 📈 Cross-Validation Results

The candidate models were evaluated using 3-fold cross-validation.

| Model               | CV Accuracy | CV Macro F1 |
| ------------------- | ----------: | ----------: |
| Logistic Regression |       0.884 |       0.774 |
| Decision Tree       |       0.935 |       0.808 |
| Random Forest       |       0.947 |       0.861 |
| Gradient Boosting   |       0.956 |       0.873 |

The values represent the mean cross-validation scores obtained on the training data.

---

# 🎯 Final Model

The final Machine Learning pipeline uses:

```text
Preprocessing
     +
Gradient Boosting Classifier
```

The model was configured with:

```python
GradientBoostingClassifier(
    random_state=42
)
```

The complete pipeline was fitted using the training data.

---

# 📊 Model Evaluation

The final model was evaluated on the held-out test set.

The evaluation includes:

* Accuracy
* Precision
* Recall
* F1-Score
* Classification Report
* Confusion Matrix

Example:

```python
y_pred = final_model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:", recall_score(y_test, y_pred))
print("F1:", f1_score(y_test, y_pred))
```

The held-out test set was kept separate from cross-validation to evaluate performance on unseen data.

---

# 🧩 Confusion Matrix

The project also includes a confusion matrix to analyze classification results.

```text
                 Predicted
              Legitimate  Fraud
Actual
Legitimate
Fraud
```

The confusion matrix helps identify:

* Correctly classified legitimate transactions
* Correctly detected fraud transactions
* False positives
* False negatives

---

# 💾 Model Saving

The complete fitted Machine Learning pipeline was saved using Joblib.

```python
import joblib

joblib.dump(
    final_model,
    "fraud_detection_model.pkl"
)
```

The saved model contains:

```text
Preprocessing
      +
Trained Gradient Boosting Model
```

This allows the FastAPI application to receive raw transaction data and apply the required preprocessing automatically.

---

# ⚡ FastAPI Backend

The trained Machine Learning pipeline was integrated with **FastAPI**.

The API accepts transaction information as JSON and returns:

* Prediction
* Fraud probability
* Legitimate probability

### API Endpoint

```text
POST /predict
```

### Health Endpoint

```text
GET /health
```

---

# 📥 API Request Example

```json
{
  "transaction_hour": 14,
  "account_age_days": 250,
  "previous_chargebacks": 0,
  "merchant_category": "Electronics",
  "transaction_country": "Pakistan",
  "device_type": "Mobile",
  "is_international": 0,
  "is_high_risk_merchant": 0,
  "transaction_amount": 1500,
  "transaction_velocity_1h": 1,
  "transaction_velocity_24h": 3,
  "avg_transaction_amount_30d": 1200
}
```

---

# 📤 API Response Example

```json
{
  "prediction": "Legitimate",
  "fraud_probability": 0.0014,
  "legitimate_probability": 0.9986
}
```

The API returns probability values between `0` and `1`.

Example:

```text
Fraud probability      → 0.0014
Legitimate probability → 0.9986
```

The frontend converts these values into percentages for display.

---

# 🌐 Frontend

A responsive web interface was developed using:

* HTML
* CSS
* JavaScript

The frontend provides fields for entering transaction information and communicates with the FastAPI backend.

```text
User
 ↓
Transaction Form
 ↓
JavaScript
 ↓
FastAPI /predict
 ↓
Machine Learning Pipeline
 ↓
Prediction
 ↓
JSON Response
 ↓
Frontend Result
```

The interface displays:

* Prediction result
* Fraud probability
* Legitimate probability
* Visual probability indicator
* API connection status

---

# 🔗 Frontend ↔ FastAPI Integration

The JavaScript frontend communicates with the deployed FastAPI backend.

```javascript
const API_URL =
  "https://ai-powered-fraud-detection.fastapicloud.dev";
```

Prediction requests are sent to:

```text
POST /predict
```

using JavaScript `fetch()`.

```javascript
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
```

---

# 🧪 Example Transaction

Example input:

```text
Transaction hour: 14
Account age: 250 days
Previous chargebacks: 0
Merchant category: Electronics
Country: Pakistan
Device: Mobile
International: No
High-risk merchant: No
Transaction amount: $1500
1-hour velocity: 1
24-hour velocity: 3
30-day average amount: $1200
```

The system sends the transaction to the Machine Learning API.

The API returns:

```text
Prediction
Fraud Probability
Legitimate Probability
```

---

# 🛠️ Technologies Used

## Machine Learning

* 🐍 Python
* 🐼 Pandas
* 🔢 NumPy
* 🤖 Scikit-Learn
* 💾 Joblib

## Data Analysis & Visualization

* 📊 Matplotlib
* 📈 Seaborn

## Backend

* ⚡ FastAPI
* 🧩 Pydantic
* 🚀 Uvicorn
* 🌐 CORS

## Frontend

* HTML
* CSS
* JavaScript

## Development & Deployment

* 📓 Jupyter Notebook
* 💻 Python 3.12
* 🐙 Git
* 🐙 GitHub
* ☁️ FastAPI Cloud
* 🌐 GitHub Pages

---

# 📂 Project Structure

```text
ai-powered-fraud-detection/
│
├── ai-powered-fraud-detection.ipynb
├── Credit-Card-Transactions.csv
├── fraud_detection_model.pkl
├── main.py
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
└── .gitignore
```

---

# 🔄 Complete Machine Learning Workflow

```text
Raw Dataset
     ↓
Data Understanding
     ↓
Exploratory Data Analysis
     ↓
Duplicate Removal
     ↓
Invalid-Value Handling
     ↓
Feature Analysis
     ↓
Feature Engineering
     ↓
Train/Test Split
     ↓
Missing-Value Handling
     ↓
Outlier Analysis
     ↓
Preprocessing
     ↓
Class Imbalance Handling
     ↓
Cross-Validation
     ↓
Model Comparison
     ↓
Final Model
     ↓
Test Evaluation
     ↓
Save Pipeline
     ↓
FastAPI Backend
     ↓
API Deployment
     ↓
Frontend Integration
     ↓
Live Fraud Detection Application
```

---

# 🎓 Key Learning Outcomes

Through this project, I practiced:

* End-to-end Machine Learning workflow
* Exploratory Data Analysis
* Data cleaning
* Duplicate removal
* Invalid-value handling
* Feature engineering
* Numerical preprocessing
* Categorical encoding
* `ColumnTransformer`
* `Pipeline`
* Class imbalance handling
* Classification algorithms
* Stratified Cross-Validation
* Model comparison
* Model evaluation
* Confusion matrix analysis
* Probability prediction
* Model serialization with Joblib
* FastAPI development
* Pydantic validation
* REST API development
* CORS configuration
* JavaScript API integration
* Machine Learning deployment
* Building a real-time prediction application

---

# 🚀 How To Use The Live App

### Step 1 — Open the Web Application

👉 **[AI Powered Fraud Detection](https://haseebniazii.github.io/ai-powered-fraud-detection/)**

### Step 2 — Enter Transaction Details

Provide the required transaction information.

### Step 3 — Analyze Transaction

Click:

```text
Analyze Transaction
```

### Step 4 — View Result

The application displays:

```text
Prediction
Fraud Probability
Legitimate Probability
```

---

# 📚 API Documentation

The deployed FastAPI application includes interactive Swagger documentation.

👉 **[Swagger API Documentation](https://ai-powered-fraud-detection.fastapicloud.dev/docs)**

The `/predict` endpoint can be tested directly from the Swagger interface.

---

# 📌 Prediction Classes

| Risk Label | Meaning                |
| ---------- | ---------------------- |
| `0`        | Legitimate transaction |
| `1`        | Fraudulent transaction |

The API converts these model labels into:

```text
0 → Legitimate
1 → Fraud
```

---

# ⚠️ Important Note

This project is an educational Machine Learning application.

The prediction represents the output of the trained model and should not be treated as a definitive determination that a real-world transaction is fraudulent.

Real-world fraud detection systems normally require additional monitoring, updated data, security controls, and human review.

---

# 📌 Conclusion

This project demonstrates an end-to-end Machine Learning system for **financial transaction fraud classification**.

The project goes beyond notebook-based Machine Learning by connecting a trained Scikit-Learn pipeline with a FastAPI backend and a web frontend.

```text
Machine Learning
       +
Data Analysis
       +
Feature Engineering
       +
FastAPI
       +
REST API
       +
JavaScript Frontend
       +
Cloud Deployment
       =
AI Powered Fraud Detection 🚀
```

---

# 👨‍💻 Author

## Haseeb Khan

**Computer Science Student | Machine Learning & AI**

GitHub:

**[haseebniazii](https://github.com/haseebniazii)**

Portfolio:

**[haseebniazii.github.io](https://haseebniazii.github.io/)**

---

# ⭐ Support

If you found this project useful, feel free to:

* ⭐ Star the repository
* 🍴 Fork the project
* 📓 Explore the notebook
* ⚡ Test the API
* 🌐 Try the live application
* 🚀 Explore the Machine Learning pipeline

**Thanks for checking out the project! 🚀**
