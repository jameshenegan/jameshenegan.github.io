## **Machine Learning Project Documentation: Loan Default Prediction**

### 1. **Project Overview**

- **Project Name**: Loan Default Prediction
- **Business Context**: The goal of this project is to predict whether a customer will default on a loan within the first 12 months. Accurate predictions will help the financial institution assess risk and make informed lending decisions. Early identification of high-risk customers allows the institution to take precautionary measures, such as adjusting interest rates or rejecting high-risk applications.
- **Stakeholders**:
  - _Business Team_: Risk Management, Credit Approval Departments
  - _Technical Team_: Data Science and Machine Learning Engineers
  - _Executive Sponsor_: Chief Risk Officer (CRO)

### 2. **Data Description**

- **Data Sources**: The data used for training was sourced from internal banking databases, which include historical loan application data, customer demographics, and repayment records.

  - **Loan Data**: Information about the loan amount, interest rates, payment schedule, and repayment history.
  - **Customer Data**: Includes age, income, employment status, credit score, and debt-to-income ratio.
  - **External Data**: Credit bureau reports, including historical defaults and credit scores.

- **Key Variables**:

  - **Target Variable**: `Default` (binary: 1 = defaulted on the loan, 0 = not defaulted)
  - **Features**:
    - **Loan Amount**: Numerical (the total loan amount)
    - **Interest Rate**: Numerical
    - **Income**: Numerical (annual income)
    - **Credit Score**: Numerical (FICO score)
    - **Debt-to-Income Ratio**: Numerical (percentage of monthly debt payments relative to income)
    - **Employment Status**: Categorical (employed, self-employed, unemployed)
    - **Loan Term**: Categorical (short-term, long-term)

- **Data Privacy Considerations**:
  - All customer information is anonymized, and sensitive details such as customer ID and social security numbers are excluded from the dataset.
  - The data is stored in a secure environment with encryption in place, in compliance with financial regulations like GLBA (Gramm-Leach-Bliley Act).

### 3. **Data Preparation**

Data preparation is a critical part of the process to ensure that the data fed into the model is clean, accurate, and well-structured for machine learning algorithms.

#### **Data Cleaning**:

- **Handling Missing Data**: Some features, such as `Credit Score` and `Income`, had missing values.
  - **Credit Score**: Missing values were imputed using the median credit score of customers in the same employment category.
  - **Income**: Missing values were filled using a linear regression model based on correlated variables (`Loan Amount` and `Debt-to-Income Ratio`).
- **Outlier Treatment**:
  - **Loan Amount**: Extreme loan amounts (above the 99th percentile) were capped to reduce the influence of outliers.
  - **Debt-to-Income Ratio**: Any values greater than 1 (100%) were capped at 1, as it is unrealistic for customers to spend more than their total income on debts.

#### **Data Transformation**:

- **Normalization**: Numerical features like `Loan Amount`, `Income`, and `Credit Score` were normalized using Min-Max scaling to bring them into a range of 0 to 1. This was done to ensure that large differences in scale across features do not affect model performance.
- **Categorical Encoding**:
  - **Employment Status** and **Loan Term** were one-hot encoded to convert categorical values into binary features that the model can interpret.

#### **Feature Engineering**:

- **New Feature Creation**:
  - A new feature `Loan-to-Income Ratio` was created by dividing the `Loan Amount` by the `Income`. This feature represents the relative size of the loan to a customer's income and was found to be a strong predictor of default during exploratory analysis.
  - Another feature, `Credit History Length`, was derived from the difference between the current year and the year the customer opened their first credit line.
- **Feature Selection**:
  - **Rejected Features**: Variables like `ZIP Code` and `Application Date` were dropped because they were irrelevant for predicting default and did not contribute to the model's accuracy.

#### **Data Splitting**:

The data was divided into:

- **Training Set**: 70% of the data was used for training the model.
- **Test Set**: 20% was reserved for evaluating model performance.
- **Validation Set**: 10% of the data was used for cross-validation during hyperparameter tuning.

#### **Class Imbalance Handling**:

The target variable `Default` was highly imbalanced (only 10% of loans defaulted). To address this:

- We used **SMOTE** (Synthetic Minority Over-sampling Technique) to generate synthetic examples of defaulted loans in the training set.
- We also tested with **class weights** in the model to give more importance to the minority class.

### 4. **Model Development**

- **Problem Framing**: The business objective of predicting loan defaults was framed as a binary classification task (Default = 1, No Default = 0).

- **Algorithm Selection**:

  - _Chosen Algorithm_: Gradient Boosting (XGBoost)
  - _Reasoning_: XGBoost was selected for its high performance with structured data and its ability to handle imbalanced datasets effectively. It also provides feature importance metrics, which aid in model interpretability.

- **Training Process**:

  - **Cross-Validation**: We used 5-fold cross-validation to prevent overfitting and optimize model performance across different subsets of the training data.
  - **Hyperparameters**:
    - Learning Rate: 0.1
    - Maximum Depth: 6
    - Number of Trees: 200
    - Subsample: 0.8 (to reduce variance and overfitting)

- **Performance Metrics**:
  - **Accuracy**: 92%
  - **Precision**: 85% (high precision is essential in identifying true defaulters)
  - **Recall**: 70% (balanced recall to ensure that we are catching most defaulters)
  - **F1 Score**: 0.77
  - **ROC AUC**: 0.88 (indicates a strong ability of the model to distinguish between default and non-default)

### 5. **Model Interpretability and Explainability**

- **Feature Importance**: XGBoost provides built-in feature importance scores. The most important features for predicting loan default were:

  - **Credit Score**: Lower credit scores significantly increased the likelihood of default.
  - **Debt-to-Income Ratio**: High debt-to-income ratios were associated with higher default risk.
  - **Loan-to-Income Ratio**: Larger loans relative to income correlated strongly with default.

- **SHAP (Shapley Additive Explanations)**:
  - SHAP was used to explain individual predictions. For example, if a particular customer was predicted to default, SHAP could explain that the decision was driven by their high debt-to-income ratio and low credit score.
  - **Global Explainability**: SHAP was also used to show how different features globally contributed to the model's decision-making process.

### 6. **Model Deployment and Monitoring**

- **Deployment Environment**: The model is deployed on Google Cloud Platform (GCP) using AI Platform. It serves real-time predictions via RESTful API, integrated with the loan approval system.
- **Model Versioning**:

  - Model versioning is managed using **MLflow**, which tracks different iterations of the model, including performance metrics, hyperparameters, and data used.

- **Performance Monitoring**:

  - The model is monitored monthly using performance metrics like accuracy, precision, and recall on new data.
  - **Data Drift Detection**: Automated alerts are triggered if the distribution of incoming loan applications changes significantly, indicating potential data drift.

- **Retraining Strategy**:
  - The model will be retrained every quarter using the latest loan data. If significant performance degradation is detected (e.g., recall drops by 5%), an immediate retraining process is triggered.

### 7. **Ethical and Legal Considerations**

- **Data Use and Consent**: Customer data was collected and processed in compliance with banking regulations and customer agreements. No sensitive information, like social security numbers, was used in the modeling process.
- **Fairness**:
  - We conducted fairness checks to ensure that the model's predictions do not unfairly target certain groups based on income or employment status. The model was found to treat all customer demographics equitably.
  - A bias audit was performed to confirm that customers with the same financial profile but different personal characteristics (age, gender, etc.) received consistent predictions.

### 8. **Risks and Mitigations**

- **Technical Risks**:

  - **Overfitting**: To mitigate overfitting, we used cross-validation and regularization techniques in XGBoost (e.g., limiting the depth of trees).
  - **Underfitting**: Ensured by using enough trees and feature engineering to capture complex patterns in the data.

- **Operational Risks**:
  - **Incorrect Predictions**: Misclassified non-defaulters could result in issuing loans to risky customers. To mitigate this, we provide uncertainty estimates for edge cases where the prediction is close to 0.5.
  - **Model Decay**: The risk of model performance degradation over time is managed through regular monitoring and retraining based on new
