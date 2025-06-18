import streamlit as st

st.title("SimPlan360: Personal Financial Scenario Simulation")

st.header("1. Personal Info")
age = st.number_input("Age", min_value=18, max_value=100, value=25)
retirement_age = st.number_input("Retirement Age", min_value=40, max_value=80, value=60)
location = st.text_input("Location")
marital_status = st.selectbox("Marital Status", ["Single", "Married", "Divorced", "Widowed"])

st.header("2. Income & Career")
current_income = st.number_input("Current Annual Income (₹)", min_value=0)
raise_pct = st.slider("Expected Annual Raise (%)", 0, 30, 5)
bonus_pct = st.slider("Average Bonus (%)", 0, 100, 10)
job_stability = st.slider("Job Stability (1 = Unstable, 5 = Very Stable)", 1, 5, 3)

st.header("3. Expenses & Liabilities")
monthly_expenses = st.number_input("Monthly Expenses (₹)", min_value=0)
rent_or_emi = st.number_input("Monthly Rent/EMI (₹)", min_value=0)
debt = st.number_input("Total Outstanding Debt (₹)", min_value=0)

st.header("4. Goals")
retirement_goal = st.number_input("Retirement Savings Target (₹)", min_value=0)
education_goal = st.number_input("Children’s Education Fund (₹)", min_value=0)
house_goal = st.number_input("House Purchase Budget (₹)", min_value=0)
travel_goal = st.number_input("Travel/Lifestyle Budget (₹)", min_value=0)

st.header("5. Risk & Market Factors")
risk_appetite = st.slider("Risk Appetite (1 = Low, 10 = High)", 1, 10, 5)
market_growth = st.slider("Expected Market Growth Rate (%)", 0, 15, 7)
inflation_rate = st.slider("Expected Inflation Rate (%)", 0, 10, 5)
shock_factor = st.slider("Economic Shock Risk (0 = None, 1 = Extreme)", 0.0, 1.0, 0.2)

# Combine into a user profile dictionary
user_profile = {
    "personal_info": {
        "age": age,
        "retirement_age": retirement_age,
        "location": location,
        "marital_status": marital_status
    },
    "income": {
        "current_income": current_income,
        "raise_pct": raise_pct,
        "bonus_pct": bonus_pct,
        "job_stability": job_stability
    },
    "expenses": {
        "monthly_expenses": monthly_expenses,
        "rent_or_emi": rent_or_emi,
        "debt": debt
    },
    "goals": {
        "retirement": retirement_goal,
        "education": education_goal,
        "house": house_goal,
        "travel": travel_goal
    },
    "risk": {
        "appetite": risk_appetite,
        "market_growth": market_growth,
        "inflation_rate": inflation_rate,
        "shock_factor": shock_factor
    }
}

# Show summary on button click
if st.button("Submit Profile"):
    st.subheader("🧾 Your Financial Profile")
    st.json(user_profile)
