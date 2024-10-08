# **Real Estate Lead Generation Model Documentation**

---

## **Table of Contents**

1. [Project Overview](#project-overview)
2. [Shared Data Management](#shared-data-management)
   - 2.1. [Shared Raw Data Sources](#shared-raw-data-sources)
   - 2.2. [Shared Raw Data Preprocessing](#shared-raw-data-preprocessing)
   - 2.3. [Shared Features for Homes and Land](#shared-features-for-homes-and-land)
3. [Shared Model Development](#shared-model-development)
   - 3.1. [Shared Modeling Framework](#shared-modeling-framework)
   - 3.2. [Shared Deployment Strategy](#shared-deployment-strategy)
4. [Shared Deployment and Governance](#shared-deployment-and-governance)
   - 4.1. [Shared Security and Access Control](#shared-security-and-access-control)
   - 4.2. [Shared Monitoring and Retraining](#shared-monitoring-and-retraining)
5. [Conclusion](#conclusion)

**Appendices:**

- [Appendix A: Home Leads Model](#appendix-a-home-leads-model)
- [Appendix B: Land Leads Model](#appendix-b-land-leads-model)

---

## **1. Project Overview**

The goal of this project is to generate high-quality leads for a real estate company. The company deals with two primary types of properties: **homes** and **land**. Although many aspects of lead generation are similar for both property types, there are distinct differences in the features and customer behaviors between home buyers and land buyers. This project uses **machine learning** to identify and prioritize leads for both homes and land, enabling the sales team to focus on high-potential prospects.

### **Business Impact**:

- **Lead Prioritization**: The model helps prioritize leads for homes and land, improving the sales team’s effectiveness.
- **Increased Sales**: By focusing on more promising leads, the company aims to improve the conversion rate for both property types.
- **Improved Customer Experience**: Better lead targeting improves the customer journey and allows for more personalized outreach.

---

## **2. Shared Data Management**

### 2.1. **Shared Raw Data Sources**

While some datasets are specific to home or land leads, there are shared data sources that provide general information about customer interactions and profiles:

- **Customer Interaction Data** (`InteractionTable`):
  - Contains interactions across the website and CRM system (e.g., property searches, inquiries).
  - **Columns**: `CustomerID`, `InteractionType`, `InteractionDate`, `PropertyViewed`, etc.
- **Customer Demographics Data** (`CustomerTable`):
  - Contains demographic details like `Age`, `IncomeLevel`, and `Location`.
  - **Columns**: `CustomerID`, `Age`, `Gender`, `IncomeLevel`, `Location`, etc.

### 2.2. **Shared Raw Data Preprocessing**

- **Data Cleaning**:

  - **Removing Duplicates**: Duplicate entries across all tables are removed based on unique identifiers (`CustomerID`, `InteractionID`).
  - **Handling Missing Data**: Missing values in fields like `IncomeLevel` are imputed based on median income in the customer’s location.

- **Data Transformation**:
  - **Shared Features**: Certain features are relevant across both home and land leads, such as `CustomerEngagementScore`, which aggregates the number of interactions a customer has across property views, inquiries, and other activities.

### 2.3. **Shared Features for Homes and Land**

- **Customer Interaction Score**: Aggregates engagement metrics from the interaction table, relevant to both home and land leads.
- **Demographic Features**: Customer demographics like `Age`, `IncomeLevel`, and `Location` are used across both models.
- **Lead Recency**: Captures how recent the customer’s interactions have been, which is a common feature across both lead types.

---

## **3. Shared Model Development**

### 3.1. **Shared Modeling Framework**

The machine learning models for both homes and land leads share a common framework for feature preprocessing, training, and validation. However, separate models are trained for each lead type to optimize for their respective differences.

- **Shared Preprocessing Pipeline**: Both models go through a shared pipeline where common features are cleaned, transformed, and standardized. Each pipeline includes:

  - Scaling of numerical features (`IncomeLevel`, `CustomerEngagementScore`).
  - One-hot encoding of categorical variables (e.g., `Location`).

- **Model Type**: Both models use **Random Forest Classifier**, as it handles both numerical and categorical features well and provides feature importance metrics.

### 3.2. **Shared Deployment Strategy**

The company uses a **shared deployment environment** for both models, managed through **Azure Machine Learning Services**. Each model (homes and land) is deployed as a separate API, but they share the same infrastructure:

- **Real-time API**: The models are deployed as RESTful APIs, with the property type (homes or land) specified at query time.
- **Load Balancing**: The same load balancing and monitoring infrastructure is used for both models, ensuring scalability and reliability.

---

## **4. Shared Deployment and Governance**

### 4.1. **Shared Security and Access Control**

- **Azure Active Directory (AAD)** is used to manage access to both datasets and models. Role-based access controls ensure that only authorized personnel can view sensitive data or modify models.
- **Encryption**: All data is encrypted both at rest and in transit using Azure’s encryption tools.

### 4.2. **Shared Monitoring and Retraining**

- **Performance Monitoring**: Both models are monitored in real-time to track key performance indicators such as precision, recall, and accuracy. If performance degrades by more than 5%, retraining is triggered.
- **Data Drift Monitoring**: A shared data drift detection system is implemented to ensure that changes in customer behavior or market conditions do not adversely affect model performance.

---

## **5. Conclusion**

The lead generation models for homes and land have been successfully deployed using shared infrastructure and processes where applicable, while accounting for the distinct features and behaviors specific to each type of lead. This hybrid approach has improved lead prioritization and sales effectiveness for both homes and land.

---

## **Appendix A: Home Leads Model**

### A.1. **Home Lead-Specific Data**

- **Property Features** (`HomePropertyTable`):
  - Contains detailed information about the properties listed as homes, including:
    - `PropertyID`, `NumberOfRooms`, `SquareFootage`, `PriceRange`, `Location`, etc.
  - This table is specific to home listings, focusing on residential property details.

### A.2. **Home Lead-Specific Preprocessing**

- **Feature Engineering**:
  - **NumberOfRooms**: Number of rooms is an important feature for home leads and is incorporated as part of the feature set.
  - **PropertyLocationProximity**: Calculates proximity to nearby schools and amenities, which is significant for home buyers.
- **Handling Missing Data**: Missing values for `NumberOfRooms` were imputed using the median number of rooms for properties in the same neighborhood.

### A.3. **Home Lead Model Development**

- **Model Training**:
  - A **Random Forest Classifier** was used to train the home lead model, using home-specific features like `NumberOfRooms`, `SquareFootage`, and `PriceRange`.
  - **Performance**:
    - **Accuracy**: 85%
    - **Precision**: 82%
    - **Recall**: 75%
    - **F1 Score**: 0.78

### A.4. **Home Lead Model Deployment**

- The home lead model is deployed as a separate API endpoint for querying lead scores specifically for home buyers. This model is monitored independently but shares the same deployment infrastructure with the land lead model.

---

## **Appendix B: Land Leads Model**

### B.1. **Land Lead-Specific Data**

- **Land Property Features** (`LandPropertyTable`):
  - Contains detailed information about land listings:
    - `PropertyID`, `LotSize`, `ZoningType`, `LandUse`, `Location`, etc.
  - These features are specific to land purchases, where lot size and zoning regulations are more important than typical residential features.

### B.2. **Land Lead-Specific Preprocessing**

- **Feature Engineering**:
  - **LotSize**: Total square footage of the land is a key feature for land leads.
  - **ZoningClassification**: Zoning type (residential, commercial, agricultural) is added as a categorical feature.
- **Handling Missing Data**: Missing values for `ZoningType` were filled based on similar properties in the same region.

### B.3. **Land Lead Model Development**

- **Model Training**:
  - A separate **Random Forest Classifier** was trained for land leads, with land-specific features like `LotSize`, `ZoningType`, and `LandUse`.
  - **Performance**:
    - **Accuracy**: 83%
    - **Precision**: 78%
    - **Recall**: 72%
    - **F1 Score**: 0.75

### B.4. **Land Lead Model Deployment**

- The land lead model is deployed as a separate API endpoint for querying lead scores specifically for land buyers. This model shares the same monitoring infrastructure

with the home lead model but has its own independent performance tracking.
