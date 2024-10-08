# **Fraud Detection in Credit Card Transactions**

## **Table of Contents**

1. [Project Overview](#project-overview)
2. [Data Management](#data-management)
   - 2.1. [Data Layout](#data-layout)
   - 2.2. [Data Lineage](#data-lineage)
   - 2.3. [Data Storage](#data-storage)
   - 2.4. [Data Preparation](#data-preparation)
   - 2.5. [Data Labeling](#data-labeling)
   - 2.6. [Data Bias Detection](#data-bias-detection)
   - 2.7. [Data Lineage Tracking and Versioning](#data-lineage-tracking-and-versioning)
3. [Model Development and Performance](#model-development-and-performance)
   - 3.1. [Model Purpose](#model-purpose)
   - 3.2. [Model Type and Algorithms](#model-type-and-algorithms)
   - 3.3. [Model Output](#model-output)
   - 3.4. [Model Performance](#model-performance)
   - 3.5. [Environment Versions and Packages](#environment-versions-and-packages)
   - 3.6. [Data Preparation Impact on Model Performance](#data-preparation-impact-on-model-performance)
4. [Deployment and Governance](#deployment-and-governance)
   - 4.1. [Deployment and Maintenance](#deployment-and-maintenance)
   - 4.2. [Ethical and Legal Considerations](#ethical-and-legal-considerations)
   - 4.3. [Monitoring and Retraining](#monitoring-and-retraining)
   - 4.4. [Output Delivery and Interpretation](#output-delivery-and-interpretation)
   - 4.5. [Security and Access Control](#security-and-access-control)
5. [Conclusion and Next Steps](#conclusion-and-next-steps)

---

## **1. Project Overview**

The goal of this project is to build a machine learning model that detects potentially fraudulent credit card transactions in real-time. By leveraging historical transaction data, customer profiles, and merchant information, the model can help the business identify fraudulent activity with minimal false positives, protecting customers while ensuring smooth transaction experiences.

### **Business Impact**:

- **Loss Prevention**: The model helps the business reduce financial losses from fraudulent transactions.
- **Customer Protection**: Real-time fraud detection prevents unauthorized charges on customer accounts.
- **Operational Efficiency**: By automating fraud detection, the company can reduce manual reviews and improve the fraud team’s workflow.

### **Key Stakeholders**:

- **Business Teams**: Fraud Detection and Risk Management Departments
- **Technical Teams**: Data Science, Machine Learning Engineers, and DevOps Teams
- **Executive Sponsor**: Chief Risk Officer (CRO)

---

## **2. Data Management**

### 2.1. **Data Layout**

- **Sources**: The dataset consists of transaction records, customer data, and merchant information.
  - **TransactionTable**: Contains transaction-specific data (e.g., amount, time, fraud label).
  - **CustomerTable**: Contains customer demographics and financial profile.
  - **MerchantTable**: Contains merchant information, such as category and location.
- **Joins**: Data from `TransactionTable` is linked to `CustomerTable` using `CustomerID`, and to `MerchantTable` using `MerchantID`.

### 2.2. **Data Lineage**

- **Data Collection**: Raw data is extracted from the company’s credit card processing system, cleaned, and transformed in the ETL pipeline before being loaded into a data warehouse.
- **Versioning**: All datasets used in this project are versioned using **DVC (Data Version Control)** for traceability and reproducibility.

### 2.3. **Data Storage**

- **Location**: Data is securely stored in **Amazon S3**, with encryption both at rest and in transit.
- **Access Control**: AWS IAM policies restrict access to authorized personnel only. All data access is logged using **AWS CloudTrail**.
- **Backup**: Data is backed up weekly and retained for 3 years.

### 2.4. **Data Preparation**

- **Cleaning**:
  - Missing values in `MerchantLocation` are filled with the mode of `MerchantCategory`.
  - Outliers in `TransactionAmount` are capped at the 99th percentile.
- **Transformation**:
  - Numerical features like `TransactionAmount` are scaled using Min-Max scaling.
  - Categorical variables (`CardType`, `MerchantCategory`) are one-hot encoded.
  - `TransactionTime` is broken down into components like hour, day, and month to capture temporal patterns.

### 2.5. **Data Labeling**

- **Target Variable**: The binary variable `IsFraud` (1 = fraud, 0 = non-fraud) is created based on historical fraud data. Confirmed fraud cases are labeled after review by fraud analysts.

### 2.6. **Data Bias Detection**

- **Audit**: The model was evaluated for fairness, ensuring no demographic group (e.g., based on age or gender) is disproportionately flagged for fraud.
- **Method**: We applied equalized odds to verify that the model predicts fraud with similar rates across all demographics.

### 2.7. **Data Lineage Tracking and Versioning**

- **Tracking**: Data transformations are logged using **DVC**, which tracks all preprocessing steps, ensuring we can reproduce the exact dataset used for each model iteration.

---

## **3. Model Development and Performance**

### 3.1. **Model Purpose**

- **Objective**: The model aims to identify fraudulent transactions in real-time, helping to protect customers and prevent financial loss. It outputs a prediction (fraud or non-fraud) for each transaction based on historical data.

### 3.2. **Model Type and Algorithms**

- **Model Type**: Binary classification.
- **Algorithm**: **LightGBM (Light Gradient Boosting Machine)** is chosen for its efficiency and ability to handle large, imbalanced datasets, such as those in fraud detection.

### 3.3. **Model Output**

- **Prediction Format**: The model produces a probability score between 0 and 1 for each transaction. Transactions with a score higher than 0.7 are classified as fraudulent (1), while those below 0.7 are labeled non-fraudulent (0).
- **API Integration**: Predictions are delivered in real-time via API to the fraud detection system.

### 3.4. **Model Performance**

- **Evaluation Metrics**:
  - **Accuracy**: 95%
  - **Precision**: 85%
  - **Recall**: 75%
  - **F1 Score**: 0.79
  - **ROC AUC**: 0.92
- **Cross-Validation**: The model was validated using **5-fold cross-validation** to ensure generalizability across different subsets of the data.

### 3.5. **Environment Versions and Packages**

- **Python Version**: 3.8
- **Packages**:
  - `LightGBM` (3.2.1)
  - `Scikit-learn` (0.24.2)
  - `Pandas` (1.2.4)
  - `NumPy` (1.19.5)
- **Environment Management**: The development environment was managed using **Conda**, and **Docker** containers were used to ensure consistency in production.

### 3.6. **Data Preparation Impact on Model Performance**

- **Impact of Transformations**: Data cleaning (e.g., outlier removal) and feature engineering (e.g., time features) improved model performance by increasing the recall by 5% and accuracy by 3%.

---

## **4. Deployment and Governance**

### 4.1. **Deployment and Maintenance**

- **Platform**: The model is deployed on **AWS Lambda** for real-time scoring of transactions. The Lambda function is triggered for each transaction, delivering predictions within 50 milliseconds.
- **Maintenance**: The model will be retrained quarterly or earlier if performance metrics degrade by more than 5%.

### 4.2. **Ethical and Legal Considerations**

- **Compliance**: The system is fully compliant with **PCI-DSS** regulations. Customer data is anonymized, and no PII is used for model training.
- **Fairness**: The model was evaluated to ensure it does not unfairly target any specific demographic group. A fairness audit was conducted, with no evidence of bias detected.

### 4.3. **Monitoring and Retraining**

- **Performance Monitoring**: Model performance is monitored in real-time. Alerts are triggered if key performance metrics (precision, recall, accuracy) drop significantly.
- **Data Drift Detection**: Data drift monitoring systems check for changes in the distribution of input data. If drift is detected, the retraining process is initiated.

### 4.4. **Output Delivery and Interpretation**

- **Real-Time API**: Predictions are delivered to the fraud detection system via an API, allowing immediate action to be taken on flagged transactions.
- **Interpretability**: **LIME** (Local Interpretable Model-agnostic Explanations) is used to explain model predictions to fraud analysts, helping them understand why certain transactions were flagged.

### 4.5. **Security and Access Control**

- **Access Control**: AWS IAM policies enforce strict access controls to ensure

only authorized personnel can access data and model predictions.

- **Audit Logs**: All data and model access is logged and monitored using **AWS CloudTrail** for audit and compliance purposes.

---

## **5. Conclusion and Next Steps**

The fraud detection model has been successfully deployed and is operating in real-time, significantly reducing fraudulent transactions and improving the customer experience. Moving forward, the model will be retrained quarterly to adapt to changing fraud patterns, and we will explore additional features like geolocation data to enhance model accuracy.
