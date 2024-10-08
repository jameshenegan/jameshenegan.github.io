## **Machine Learning Project Documentation: Fraud Detection in Credit Card Transactions**

### 1. **Project Overview**

- **Project Name**: Fraud Detection in Credit Card Transactions
- **Business Context**: The objective of this project is to detect fraudulent credit card transactions in real-time. The model will be deployed to flag potentially fraudulent transactions and prevent financial loss. Accurate detection is crucial for minimizing false positives, which can frustrate customers, while also maximizing the identification of fraudulent activity.
- **Stakeholders**:
  - _Business Team_: Risk and Fraud Detection Department, Customer Service
  - _Technical Team_: Data Science Team, DevOps Team
  - _Executive Sponsor_: Chief Risk Officer (CRO)

### 2. **Data Layout**

- **Data Source**: The data used for training the model is derived from multiple tables within the company’s credit card transaction system:
  - **Transaction Data**: Includes transaction amount, time, merchant details, and transaction status (fraud or non-fraud).
  - **Customer Data**: Includes demographic information (age, gender), account balance, transaction history, and card type.
  - **Merchant Data**: Includes merchant category, location, and past fraud incidents.
- **Data Layout**: The dataset is stored in three primary tables:

  1. `TransactionTable`: Contains individual transaction records, including `TransactionID`, `CustomerID`, `TransactionAmount`, `TransactionTime`, and `IsFraud`.
  2. `CustomerTable`: Contains customer information such as `CustomerID`, `Age`, `AccountBalance`, and `CardType`.
  3. `MerchantTable`: Contains merchant details, such as `MerchantID`, `MerchantCategory`, and `MerchantLocation`.

- **Data Joins**: The `TransactionTable` is joined with the `CustomerTable` and `MerchantTable` on the `CustomerID` and `MerchantID` fields, respectively, to create a unified dataset for modeling.

### 3. **Data Lineage**

- **Data Collection**: Raw transaction data is collected in real-time through the company’s credit card processing system and stored in the transaction database.
- **Data Processing**: The raw data is extracted, transformed, and loaded (ETL) into the model pipeline. Data is aggregated daily from the transaction logs, and a historical dataset is created for model training.
- **Versioning**: All datasets used in the project are versioned using **DVC (Data Version Control)** to ensure traceability and reproducibility of the modeling process.
- **Data Lineage Diagram**: [Insert visual diagram] to show how the data flows from raw collection, through ETL, and into the model.

### 4. **Data Storage**

- **Storage Location**: All data is stored in an encrypted **Amazon S3** bucket, with restricted access based on roles (e.g., only the Data Science Team has write access to training data).
- **Backup & Security**: Data backups are conducted weekly and stored in a secondary region. Access to the data is secured via AWS IAM policies, and all API interactions with the data are logged for auditing purposes.
- **Data Retention**: Transaction data is retained for 3 years for audit purposes, with regular checks to ensure compliance with financial regulations (e.g., PCI-DSS).

### 5. **Data Preparation**

Data preparation is a critical step to ensure the dataset is suitable for model training and deployment.

#### **Data Cleaning**:

- **Handling Missing Values**:
  - Some features, such as `MerchantLocation`, had missing data for a small percentage of transactions (~5%). These missing values were filled using the most frequent value (mode) within the `MerchantCategory`.
- **Outlier Detection**:
  - Outliers in the `TransactionAmount` feature were capped at the 99th percentile to reduce the impact of anomalous transactions (e.g., unusually high amounts).
- **Duplicate Removal**: Duplicate transactions (same `TransactionID`, `TransactionAmount`, and `TransactionTime`) were removed to prevent bias from repeated data points.

#### **Data Transformation**:

- **Normalization**: Features such as `TransactionAmount` and `AccountBalance` were normalized using **Min-Max scaling** to bring them within a range of 0 to 1.
- **Categorical Encoding**:
  - Features such as `CardType` and `MerchantCategory` were one-hot encoded to convert categorical values into a numerical format for model training.
- **Time Features**: The `TransactionTime` feature was transformed into meaningful components, such as hour of day and day of week, to capture temporal patterns in fraudulent activity.

### 6. **Data Labeling**

- **Target Variable**: The target variable `IsFraud` (binary: 1 = fraud, 0 = non-fraud) is derived from historical transaction data, which includes confirmed fraud incidents verified by the Risk and Fraud Department.
- **Label Source**: The labels were generated from a combination of automated fraud detection systems and manual verification by fraud analysts. False positives were reviewed and reclassified by the risk team.

### 7. **Model Purpose**

The purpose of this model is to predict whether a given credit card transaction is fraudulent. The model will help prevent financial loss and safeguard customer accounts by flagging suspicious transactions in real-time.

### 8. **Model Type and Algorithms**

- **Model Type**: Binary Classification (fraud or non-fraud)
- **Chosen Algorithm**: **LightGBM (Light Gradient Boosting Machine)**
  - **Reasoning**: LightGBM was chosen due to its ability to handle large datasets efficiently and its high performance with imbalanced data. It is also suitable for real-time prediction scenarios due to its low inference time.

### 9. **Data Bias Detection**

- **Bias Audit**: We conducted a fairness audit to ensure that the model does not disproportionately classify transactions as fraudulent based on customer demographics (e.g., age, gender).
- **Results**: No significant disparities were found in the fraud prediction rates across demographic groups. Techniques such as **equal opportunity checks** were used to verify fairness in the model's decision-making process.

### 10. **Environment Versions and Packages**

To ensure reproducibility, the following environment and packages were used:

- **Python Version**: 3.8
- **Key Libraries**:
  - `LightGBM` (version 3.2.1)
  - `Scikit-learn` (version 0.24.2)
  - `Pandas` (version 1.2.4)
  - `NumPy` (version 1.19.5)
  - **Environment Management**: All dependencies were managed using **Conda** and logged in an `environment.yml` file. The model is deployed in a **Docker container** to ensure consistency between development and production environments.

### 11. **Model Output**

- **Output Format**: The model generates a **probability score** between 0 and 1 for each transaction, representing the likelihood that the transaction is fraudulent. A threshold of **0.7** is used to classify a transaction as fraudulent (1) or non-fraudulent (0).
- **Output Delivery**: Predictions are delivered via an **API** to the fraud detection system, which immediately flags high-risk transactions for further review or automated blocking.
- **Threshold Tuning**: The threshold can be adjusted based on business needs (e.g., higher thresholds for stricter fraud detection).

### 12. **Model Performance**

- **Performance Metrics**:
  - **Accuracy**: 95%
  - **Precision**: 85% (to ensure that flagged frauds are likely to be true frauds)
  - **Recall**: 75% (to ensure most actual frauds are detected)
  - **F1 Score**: 0.79
  - **ROC AUC**: 0.92
- **Confusion Matrix**:
  - True Positives: 1,250
  - False Positives: 300
  - True Negatives: 9,500
  - False Negatives: 150
- **Cross-Validation**: The model was validated using **5-fold cross-validation** to ensure robustness and avoid overfitting.
- **Monitoring**: The model’s performance is monitored in real-time, and an automated alert is set to trigger if precision or recall drops by more than 5%.

### 13. **Data Lineage Tracking and Versioning**

- **Version Control**: Both the dataset and model were tracked using **DVC**, which provides detailed logs of data transformations, dataset versions, and model performance over time. Each dataset used in training, testing, and validation has a unique version tag.

### 14. **Deployment and Maintenance**

- **Deployment Environment**: The model is deployed on **AWS Lambda** for real-time scoring of credit card transactions. It integrates with the existing fraud detection system via an API.
- **Monitoring & Retraining**: The model will be retrained quarterly, or sooner if the model performance metrics (e.g., precision or recall) degrade by more than 5% due to changes in transaction patterns (detected via **data drift** monitoring).

### 15. **Ethical and Legal Considerations**

- **Data Privacy**: The system complies with financial regulations such as **PCI-DSS**. Customer data is anonymized before being used in the model, and all personally identifiable information (PII) is removed.
- **Ethical Impact**: We’ve ensured that

the model does not unfairly target certain demographics (e.g., based on age or income level) by conducting a comprehensive fairness audit.

- **Customer Impact**: Measures are in place to handle false positives, such as notifying customers in real-time if their transactions are flagged as potentially fraudulent, allowing them to immediately verify the transaction.

---

### Conclusion and Next Steps:

The fraud detection model provides high accuracy and reliable predictions, flagging suspicious transactions for review in real-time. The model has been deployed in the production environment and is actively monitoring transactions. We will conduct periodic retraining to ensure the model adapts to evolving fraud patterns. Further improvements may include experimenting with ensemble models or exploring deeper interpretability techniques such as **LIME**.
