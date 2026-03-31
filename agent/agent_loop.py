import json
import logging
from typing import Any, Dict, List, Optional

from agent.planner import ReasoningPlanner
from agent.executor import ToolExecutor
from agent.synthesizer import ReasoningSynthesizer
from agent.evaluator import Evaluator
from tools.tool_registry import TOOL_REGISTRY

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Agent:
    def __init__(self, max_retries: int = 1):
        self.planner = ReasoningPlanner()
        self.executor = ToolExecutor(TOOL_REGISTRY)
        self.synthesizer = ReasoningSynthesizer()
        self.evaluator = Evaluator()
        self.max_retries = max_retries

    def run(self, user_query: str) -> Dict[str, Any]:
        """
        Runs the agent loop: Plan -> Execute -> Synthesize -> Evaluate (with optional retry).
        """
        attempts = 0
        last_feedback = None

        while attempts <= self.max_retries:
            logger.info(f"Starting agent loop attempt {attempts + 1}")
            
            # 1. Plan
            # If we have feedback from a previous failed attempt, we could potentially pass it to the planner,
            # but for DAY 5 we keep it simple as specified.
            plan = self.planner.create_plan(user_query)
            logger.info(f"Plan created: {plan}")

            # 2. Execute
            tool_results = {}
            plan_steps = plan.get("plan", [])
            
            if "tools_required" in plan and plan["tools_required"] != ["NONE"]:
                for i, tool_call in enumerate(plan["tools_required"]):
                    tool_name = tool_call.get("tool_name")
                    raw_args = tool_call.get("args", {})
                    
                    # Resolve placeholders like "<result_from_step_1>"
                    resolved_args = {}
                    for k, v in raw_args.items():
                        if isinstance(v, str) and v.startswith("<result_from_step_"):
                            try:
                                # Extract step index (1-based from prompt -> 0-based for list)
                                step_idx = int(v.split("_")[-1].replace(">", "")) - 1
                                # We correlate tool calls by index
                                previous_tool_name = plan["tools_required"][step_idx]["tool_name"]
                                resolved_args[k] = tool_results.get(previous_tool_name)
                            except (IndexError, ValueError):
                                logger.warning(f"Could not resolve placeholder: {v}")
                                resolved_args[k] = v
                        else:
                            resolved_args[k] = v

                    try:
                        logger.info(f"Executing tool {tool_name} with resolved args")
                        result = self.executor.execute(tool_name, **resolved_args)
                        tool_results[tool_name] = result
                    except Exception as e:
                        logger.error(f"Error executing tool {tool_name}: {e}")
                        tool_results[tool_name] = f"Error: {str(e)}"

            # 3. Synthesize
            synthesis = self.synthesizer.synthesize(user_query, tool_results)
            logger.info(f"Synthesis complete: {synthesis}")

            # 4. Evaluate
            evaluation = self.evaluator.evaluate(user_query, synthesis.get("final_answer", ""))
            logger.info(f"Evaluation: {evaluation}")

            if evaluation.get("is_satisfactory"):
                return {
                    "status": "success",
                    "attempts": attempts + 1,
                    "plan": plan,
                    "tool_results": tool_results,
                    "synthesis": synthesis,
                    "evaluation": evaluation
                }

            # 5. Retry logic
            logger.warning(f"Attempt {attempts + 1} unsatisfactory. Feedback: {evaluation.get('feedback')}")
            last_feedback = evaluation.get("feedback")
            attempts += 1
            # In a more advanced version, we might append feedback to the query or planner context.
            # But the constraint says no memory, so we just retry once.

        return {
            "status": "failed",
            "attempts": attempts,
            "last_feedback": last_feedback,
            "synthesis": synthesis, # Return the last attempt's synthesis anyway
            "evaluation": evaluation
        }
