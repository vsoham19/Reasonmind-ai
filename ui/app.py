import streamlit as st
import sys
import os
import json

# Add the project root to sys.path to allow imports from other directories
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agent.agent_loop import Agent
try:
    from knowledge.nifty_knowledge import DATA_AS_OF
except ImportError:
    DATA_AS_OF = "Syncing..." 

def apply_custom_styles():
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        * {
            font-family: 'Inter', sans-serif;
        }
        
        .main {
            background-color: #0d1117;
            color: #c9d1d9;
        }
        
        .stButton>button {
            background: linear-gradient(90deg, #1f6feb 0%, #388bfd 100%);
            color: white;
            border-radius: 8px;
            font-weight: 600;
            border: none;
            padding: 12px 24px;
            transition: all 0.3s ease;
        }
        
        .stButton>button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(56, 139, 253, 0.4);
        }
        
        .report-card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
            color: #c9d1d9;
        }
        
        .metric-badge {
            background-color: #21262d;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 4px 12px;
            font-size: 0.85rem;
            color: #58a6ff;
            font-weight: 600;
        }
        
        .status-success { color: #3fb950; font-weight: bold; }
        .status-error { color: #f85149; font-weight: bold; }
        
        h1, h2, h3 {
            color: #ffffff;
        }

        /* Adjusting text areas and inputs */
        .stTextArea textarea {
            background-color: #0d1117 !important;
            color: #c9d1d9 !important;
            border: 1px solid #30363d !important;
        }

        .stTabs [data-baseweb="tab-list"] {
            gap: 24px;
            background-color: transparent;
        }

        .stTabs [data-baseweb="tab"] {
            height: 45px;
            white-space: pre-wrap;
            background-color: #161b22;
            border-radius: 4px 4px 0px 0px;
            gap: 1px;
            padding-top: 10px;
            padding-bottom: 10px;
            color: #c9d1d9;
        }

        .stTabs [aria-selected="true"] {
            background-color: #0d1117;
            border-bottom: 2px solid #58a6ff !important;
        }
        </style>
    """, unsafe_allow_html=True)

def main():
    # Page configuration
    st.set_page_config(
        page_title="ReasonMind v2 | Financial Intelligence",
        page_icon="📈",
        layout="wide"
    )

    apply_custom_styles()

    # Header
    col_h1, col_h2 = st.columns([3, 1])
    with col_h1:
        st.title("📈 ReasonMind v2")
        st.markdown("<p style='color: #8b949e; font-size: 1.2rem;'>Nifty Knowledge-Grounded Intelligence Engine</p>", unsafe_allow_html=True)
    with col_h2:
        st.info("⚡ **Deterministic & Explainable**")

    st.markdown("---")

    # Sidebar
    with st.sidebar:
        st.header("⚙️ Engine Configuration")
        st.caption(f"v2.0.0-gold | Data as of: {DATA_AS_OF}")
        
        max_retries = st.slider("Reasoning Depth", 0, 3, 1)
        st.divider()
        
        st.markdown("### 📋 Supported Companies")
        st.caption("Reliance, TCS, Infosys, HDFC Bank, ITC, HUL, Sun Pharma, L&T")
        
        st.markdown("### 💡 Example Queries")
        st.info("Compare TCS and Infosys for long-term investment.")
        st.info("Is ITC a safe defensive stock?")
        st.info("Evaluate Reliance from valuation and debt perspective.")

    # Main Input
    user_query = st.text_area(
        "Financial Inquiry",
        placeholder="Ask about Nifty companies, comparisons, or risk assessments...",
        height=100
    )

    if st.button("Generate Intelligence Report", type="primary"):
        if not user_query.strip():
            st.warning("Please enter a financial inquiry.")
            return

        agent = Agent(max_retries=max_retries)

        with st.spinner("Analyzing knowledge base and computing scores..."):
            try:
                result = agent.run(user_query)
                synthesis = result.get("synthesis", {})

                # Top Results Area
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Confidence Score", f"{synthesis.get('confidence_score', 'N/A')}%")
                with col2:
                    st.metric("Valuation Analysis", "Done", delta="Numeric Grounded")
                with col3:
                    st.metric("Risk Assessment", "Done", delta="Deterministic")

                st.markdown("---")

                # Main Content
                tab1, tab2, tab3 = st.tabs(["📄 Financial Report", "🔍 Engine Trace", "🛡️ Validation"])

                with tab1:
                    report_content = synthesis.get("final_answer", "No report generated.")
                    st.markdown(f"<div class='report-card'>{report_content}</div>", unsafe_allow_html=True)

                with tab2:
                    st.subheader("Step-by-Step Reasoning Plan")
                    plan = result.get("plan", {})
                    for i, step in enumerate(plan.get("plan", [])):
                        st.markdown(f"**Step {i+1}:** {step}")
                    
                    st.divider()
                    st.subheader("Raw Knowledge Extraction")
                    st.json(result.get("tool_results", {}))

                with tab3:
                    evaluation = result.get("evaluation", {})
                    if evaluation.get("is_satisfactory"):
                        st.success(f"✅ **Grounded in Reality:** {evaluation.get('feedback')}")
                    else:
                        st.warning(f"⚠️ **Attention Required:** {evaluation.get('feedback')}")
                    
                    st.markdown("### Evidence Sources")
                    st.caption("This report is generated using deterministic scoring formulas (PE Relative, ROE, DER) and ground-truth knowledge base.")

            except Exception as e:
                st.error(f"Engine Exception: {str(e)}")

    # Footer
    st.divider()
    st.caption("ReasonMind v2 — Nifty Financial Intelligence Engine | Non-Live Data for Demo Purposes")

if __name__ == "__main__":
    main()
