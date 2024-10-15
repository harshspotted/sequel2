import { getInsightsData } from "../../modules/whoop/LLMLogic";
import { handleStoreInsights } from "../storage";

export const makeInsight = async (moduleName: string, data: string) => {
	if (!data) return
	try {
		const result = await getInsightsData(moduleName, data)
		if (!result) return
		handleStoreInsights(result, moduleName)
	} catch (e) {
		console.error(e, "error making insight")
	}
};
