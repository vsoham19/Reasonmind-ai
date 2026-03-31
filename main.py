from agent.agent_loop import Agent
import json

def main():
    agent = Agent(max_retries=1)
    
    user_query = "Compare TCS and Infosys for long-term investment viability based on their valuation and risk scores."
    
    print(f"\nUser Query: {user_query}")
    print("-" * 30)

    result = agent.run(user_query)

    print("\n=== AGENT LOOP OUTPUT ===")
    print(json.dumps(result, indent=2))
    
    if result["status"] == "success":
        print("\nFinal Answer successful and evaluated.")
    else:
        print("\nFinal Answer unsatisfactory after retries or failed.")

if __name__ == "__main__":
    main()
