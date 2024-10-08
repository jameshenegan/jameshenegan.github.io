## **Machine Learning Project Documentation: Fraud Detection in Credit Card Transactions**

---

### **1. Data Management**

This section focuses on how data is collected, cleaned, stored, and prepared for use in the model.

#### 1.1. **Data Layout**

- **Data Sources**: The data used for training the fraud detection model is sourced from the company’s transaction processing system. It is composed of three primary tables:

  - **TransactionTable**: Contains details of credit card transactions, including `TransactionID`, `CustomerID`, `TransactionAmount`, `TransactionTime`, and the fraud label `IsFraud`.
  - **CustomerTable**: Contains customer demographics, including `CustomerID`, `Age`, `AccountBalance`, and `CardType`.
  - **MerchantTable**: Contains merchant information, such as `MerchantID`, `MerchantCategory`, and `MerchantLocation`.

- **Data Joins**: The `TransactionTable` is joined with the `CustomerTable` and `MerchantTable` using `CustomerID` and `MerchantID`, respectively, to build a unified dataset for model training.

#### 1.2. **Data Lineage**

- **Collection Process**: The data is collected in real-time from the company’s transaction processing system. It undergoes ETL (extract, transform, load) processes before being added to the data warehouse for analysis.
- **Transformation Steps**: Raw transaction data is cleaned, normalized, and joined with customer and merchant data. The historical dataset is aggregated and versioned for training.
- **Versioning**: Each dataset used in this project is tracked using **DVC (Data Version Control)**, allowing us to trace how the data has evolved over time.

#### 1.3. **Data Storage**

- **Storage Location**: All data, including raw and processed data, is stored in encrypted **Amazon S3** buckets. Access to data is restricted using AWS Identity and Access Management (IAM) policies, ensuring only authorized personnel have access.
- **Security Measures**: Data is encrypted at rest and in transit. AWS CloudTrail is used to log and monitor data access.
- **Backup and Retention**: Data is backed up weekly and stored for 3 years, in compliance with financial regulations like PCI-DSS.

#### 1.4. **Data Preparation**

- **Data Cleaning**:

  - **Missing Data**: The `MerchantLocation` feature had missing values (~5% of cases). Missing values were filled using the mode of `MerchantCategory`.
  - **Outlier Detection**: Outliers in `TransactionAmount` were capped at the 99th percentile to prevent skewing the model.
  - **Duplicate Removal**: Duplicate transactions with the same `TransactionID` and timestamp were removed.

- **Data Transformation**:
  - **Scaling**: Features like `TransactionAmount` and `AccountBalance` were normalized using Min-Max scaling.
  - **Encoding**: Categorical variables like `CardType` and `MerchantCategory` were one-hot encoded for the model.
  - **Time Features**: `TransactionTime` was transformed into hour of day, day of week, and month to capture potential time-based fraud patterns.

#### 1.5. **Data Labeling**

- **Target Variable**: The binary target variable `IsFraud` (1 for fraud, 0 for non-fraud) is derived from historical transaction data. Fraud cases are verified by the fraud detection team through a combination of automated systems and manual reviews.
- **Labeling Process**: Labels are applied after confirmed investigations by fraud analysts, ensuring the quality and accuracy of the labeled data.

#### 1.6. **Data Bias Detection**

- **Bias Audit**: A fairness audit was conducted to ensure that the model does not disproportionately flag transactions as fraudulent based on demographic characteristics, such as age or gender.
- **Results**: No significant differences were found in the fraud prediction rates across different demographic groups. The model was evaluated using equalized odds to ensure fairness.

#### 1.7. **Data Lineage Tracking and Versioning**

- **Data Lineage**: Data flow and transformations are logged using **DVC**, ensuring we can trace back to specific datasets and transformations used in any model version.
- **Version Control**: Every dataset version used in the model training and validation pipeline is tagged, allowing for complete reproducibility of the data preparation steps.

---

### **2. Model Development and Performance**

This section focuses on building, evaluating, and ensuring the fairness and robustness of the model.

#### 2.1. **Model Purpose**

- **Objective**: The goal of this model is to detect potentially fraudulent transactions in real time. Accurate detection of fraud minimizes financial losses and protects customer accounts from unauthorized use.
- **Business Impact**: Early detection of fraud helps reduce chargeback losses and improves customer trust by preventing unauthorized transactions from being processed.

#### 2.2. **Model Type and Algorithms**

- **Model Type**: Binary classification to predict whether a transaction is fraudulent (1) or not fraudulent (0).
- **Algorithm**: The **LightGBM (Light Gradient Boosting Machine)** algorithm was selected for its high performance with large datasets, efficiency in handling imbalanced data, and suitability for real-time predictions.

#### 2.3. **Model Output**

- **Output Format**: The model generates a probability score between 0 and 1, indicating the likelihood of a transaction being fraudulent. A probability threshold of **0.7** is used to classify a transaction as fraudulent (1) or non-fraudulent (0).
- **Prediction Flow**: Predictions are delivered through an API to the fraud detection system, which can automatically block flagged transactions or trigger manual reviews.

#### 2.4. **Model Performance**

- **Evaluation Metrics**:

  - **Accuracy**: 95%
  - **Precision**: 85% (to minimize false positives and ensure legitimate transactions aren’t wrongly flagged)
  - **Recall**: 75% (to catch as many actual fraudulent transactions as possible)
  - **F1 Score**: 0.79 (harmonic mean of precision and recall)
  - **ROC AUC**: 0.92 (high ability to distinguish between fraud and non-fraud cases)

- **Confusion Matrix**:

  - True Positives: 1,250
  - False Positives: 300
  - True Negatives: 9,500
  - False Negatives: 150

- **Cross-Validation**: A **5-fold cross-validation** was performed to validate the model and reduce overfitting. The model showed consistent performance across all folds.

#### 2.5. **Environment Versions and Packages**

- **Python Version**: 3.8
- **Key Libraries**:
  - `LightGBM` (version 3.2.1)
  - `Scikit-learn` (version 0.24.2)
  - `Pandas` (version 1.2.4)
  - `NumPy` (version 1.19.5)
- **Environment Management**: The development environment was managed using **Conda**, and the model was deployed in a **Docker** container to ensure consistency across development and production environments.

#### 2.6. **Data Preparation Impact on Model Performance**

- **Importance of Data Cleaning**: Proper handling of missing data and outliers improved model accuracy and precision. For example, imputing missing values for `MerchantLocation` reduced noise in the dataset.
- **Feature Engineering**: Transforming the `TransactionTime` feature into temporal components (e.g., hour of day) helped capture patterns in fraudulent activity, improving recall by 5%.

---

### **3. Deployment and Governance**

This section describes the deployment, monitoring, security, and governance practices that ensure the model performs well in production and complies with regulations.

#### 3.1. **Deployment and Maintenance**

- **Deployment Environment**: The model is deployed on **AWS Lambda** for real-time transaction scoring. The Lambda function is triggered for each credit card transaction processed, and predictions are returned within 50ms.
- **API Integration**: The fraud detection model is integrated with the company's existing transaction processing system via an API, allowing it to flag suspicious transactions in real time.
- **Maintenance**: The model will be retrained quarterly, or sooner if significant performance degradation (e.g., drop in precision or recall) is detected.

#### 3.2. **Ethical and Legal Considerations**

- **Data Privacy Compliance**: The system complies with **PCI-DSS** standards. Customer PII (personally identifiable information) is anonymized before being used for model training, and all data is encrypted.
- **Ethical Considerations**: Measures were taken to ensure that the model does not unfairly flag transactions from certain demographic groups. A fairness audit was conducted to verify this, and no bias was found.

#### 3.3. **Monitoring and Retraining**

- **Performance Monitoring**: The model’s performance is monitored continuously. Key performance indicators (KPIs) like accuracy, precision, and recall are tracked. Alerts are triggered if any of these metrics drop by more than 5%.
- **Data Drift Detection**: Automated systems check for data drift, monitoring changes in transaction patterns over time. If drift is detected, retraining will be initiated ahead of the scheduled quarterly retraining.

#### 3.4. **Output Delivery and Interpretation**

- **Real-time API**: Model predictions are delivered via an API to the fraud detection system. High-risk transactions are automatically blocked or flagged for manual review.
- **Model Interpretation**: \*\*LIME (Local Inter

pretable Model-agnostic Explanations)\*\* is used to provide interpretability for flagged transactions. Fraud analysts can use LIME to understand why the model flagged a transaction as fraudulent.

#### 3.5. **Security and Access Control**

- **Access Control**: Only authorized personnel, including the Data Science and Risk Management teams, have access to the model and data. AWS IAM policies enforce strict access control.
- **Audit Logs**: All interactions with customer data and the model are logged using **AWS CloudTrail** to maintain a complete audit trail for security and compliance purposes.

---

### Conclusion and Next Steps

The fraud detection model is live and operating in real-time, delivering high accuracy and reducing financial losses by flagging fraudulent transactions. Moving forward, the model will be retrained periodically, and the business impact will be measured by comparing fraud rates before and after implementation. Future improvements could include integrating new data sources, such as geolocation data, to further enhance fraud detection accuracy.
