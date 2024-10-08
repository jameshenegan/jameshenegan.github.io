## **Machine Learning Project Documentation: Customer Churn Prediction**

### 1. **Project Overview**

- **Project Name**: Customer Churn Prediction
- **Business Context**: The goal of this project is to predict whether a customer will churn (leave the company) in the next 6 months. The model will help the marketing and retention teams target at-risk customers with tailored offers to reduce churn. Retaining customers is critical for maintaining revenue and reducing the costs associated with acquiring new customers.
- **Stakeholders**:
  - _Business Team_: Marketing and Customer Retention Departments
  - _Technical Team_: Data Analytics Team (Data Scientists, ML Engineers)
  - _Executive Sponsor_: Chief Marketing Officer (CMO)

### 2. **Data Description**

- **Data Sources**: The data used for model training is sourced from internal customer relationship management (CRM) databases and website interaction logs.

  - **CRM Data**: Includes customer demographics, subscription type, monthly payment, tenure with the company, and historical churn data.
  - **Interaction Logs**: Tracks customer engagement, including website visits, customer service requests, and product usage metrics.

- **Key Variables**:

  - **Target Variable**: `Churn` (binary: 1 = churn, 0 = no churn)
  - **Features**:
    - **Customer Age**: Numerical
    - **Monthly Charges**: Numerical
    - **Tenure**: Numerical (number of months)
    - **Contract Type**: Categorical (monthly, yearly)
    - **Customer Service Calls**: Numerical
    - **Online Engagement**: Numerical (number of website logins)
    - **Payment Method**: Categorical (credit card, bank transfer, etc.)

- **Data Privacy Considerations**:
  - Customer identifiers have been removed from the dataset.
  - Data is stored securely with encryption.
  - Only anonymized features are used, in compliance with data privacy regulations (GDPR/CCPA).

### 3. **Model Development**

- **Problem Framing**: The business problem is framed as a binary classification task. The objective is to predict whether a customer will churn (1) or stay (0).
- **Algorithm Selection**:

  - _Chosen Algorithm_: Random Forest
  - _Reasoning_: Random Forest was selected because of its high interpretability and ability to handle both categorical and numerical data effectively. It also helps to minimize overfitting through ensemble methods.

- **Training Process**:

  - **Train-Test Split**: The dataset was split into 80% training data and 20% test data.
  - **Cross-Validation**: We used 5-fold cross-validation to tune hyperparameters and avoid overfitting.
  - **Hyperparameters**:
    - Number of trees (estimators): 100
    - Maximum depth: 10
    - Minimum samples per leaf: 5

- **Performance Metrics**:
  - We evaluated the model using the following metrics:
    - **Accuracy**: 85%
    - **Precision**: 78% (to measure how many predicted churns were actual churns)
    - **Recall**: 70% (to measure how many true churns were correctly identified)
    - **F1 Score**: 0.74 (harmonic mean of precision and recall)
    - **ROC AUC**: 0.82 (measures the model's ability to distinguish between churn and no churn)

### 4. **Model Interpretability and Explainability**

- **Explainability Technique**: SHAP (Shapley Additive Explanations) was used to explain individual predictions and global feature importance.

  - **Feature Importance**: The top three important features identified by SHAP were:
    - **Tenure**: Longer tenure significantly decreases the likelihood of churn.
    - **Monthly Charges**: Higher monthly charges increase the likelihood of churn.
    - **Customer Service Calls**: More calls to customer service correlate with higher churn risk.

- **Bias and Fairness**: We examined the model for bias, ensuring that no specific demographic group (e.g., based on age or payment method) was unfairly targeted or favored in the prediction results.

### 5. **Model Deployment and Monitoring**

- **Deployment Environment**: The model is deployed in the company's cloud-based infrastructure (AWS) using Amazon SageMaker for serving real-time predictions via an API.
- **Model Versioning**:

  - Each version of the model is tracked using DVC (Data Version Control). This includes version control for data, model parameters, and performance metrics.

- **Performance Monitoring**:

  - The model is monitored weekly using an automated system that tracks prediction accuracy on a rolling basis. Data drift is also monitored to ensure that changes in customer behavior over time do not degrade model performance.

- **Retraining Strategy**:
  - The model is retrained every 6 months using new customer data. If a significant drop in accuracy (e.g., by 5%) is observed before that period, we trigger a model review and potential retraining.

### 6. **Ethical and Legal Considerations**

- **Data Use and Consent**: All customer data used in the model is anonymized, and customers were informed and consented to their data being used for predictive modeling in the company's terms and conditions. The company adheres to GDPR and CCPA guidelines.
- **Impact Assessment**:
  - We conducted a fairness analysis and ensured that there were no significant differences in the model’s performance across different age groups, genders, or payment methods.
  - The model was found to have no disparate impact on vulnerable customer groups.

### 7. **Risks and Mitigations**

- **Technical Risks**:

  - **Overfitting**: Mitigated through cross-validation and limiting model complexity (e.g., limiting max depth of decision trees).
  - **Underfitting**: Managed by using enough decision trees and ensuring sufficient feature engineering.

- **Operational Risks**:
  - **Data Drift**: We have implemented weekly performance monitoring and alert systems to detect data drift. If significant drift is detected, an investigation and retraining may be initiated earlier than scheduled.
  - **Model Misinterpretation**: Clear documentation has been provided to the business teams about how the model predictions should be interpreted. We have also provided a user-friendly dashboard that summarizes churn risk without exposing the technical complexity of the model.

### 8. **Conclusion and Recommendations**

- **Business Insights**:

  - The model has identified high-risk customer segments that are likely to churn, enabling the marketing and customer service teams to target their efforts effectively.
  - Customers with high monthly charges and frequent customer service interactions represent a key at-risk group.

- **Next Steps**:
  - A/B testing should be conducted to assess the effectiveness of targeted interventions (e.g., discounts or special offers) on at-risk customers identified by the model.
  - Continuous monitoring is recommended, particularly as new customer segments or products are introduced.

### 9. **Appendix**

- **Code References**: The full source code used for training, evaluating, and deploying the model is available in the company's GitHub repository.
- **References**:
  - SHAP (Shapley Additive Explanations): https://shap.readthedocs.io/
  - Random Forest Classifier: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html
