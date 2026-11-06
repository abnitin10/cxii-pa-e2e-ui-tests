
import { createSocialMediaPost } from "@commerce/AITools/createSocialMediaPost";
import { generateBlogPost } from "@commerce/AITools/generateBlogPost";
import { generateProductBannerTxt } from "@commerce/AITools/generateProductBannerText";
import { Settings } from "@core/Settings";
import { ProductAttributes } from "@commerce/ProductAttributes";
import { ProductDescription } from "@commerce/ProductDescription";
import { VisualSearch } from "@commerce/VisualSearch";
import { AIToolsBuilder } from "@core/AIToolsBuilder";
import { IntelligentQA } from "@core/IntelligentQA";
import { createAccountSummary } from "@sales/AITools/createAccountSummary";
import { createKnowledgeBasedArticle } from "@sales/AITools/createKnowledgeBasedArticle";
import { generateQuestionForDiscoveryCall } from "@sales/AITools/generateQuestionsDiscoveryCall";
import { personalizedProspectingEmail } from "@sales/AITools/personalizedProspectingEmail";
import { summarizeSalesOppotunity } from "@sales/AITools/summarizeSalesOpportunity";
import { SummaryOfProductReviews } from "@sales/AITools/SummaryofProductReviews";
import { writeCaseOverview } from "@sales/AITools/writeCaseOverview";
import { writeCustServiceResponse } from "@sales/AITools/writeCustomerServiceResponse";
import { Meetings } from "@sales/Meetings";
import { Scheduling } from "@sales/Scheduling";
import { SmartActions } from "@sales/SmartActions";
import { AskTheProduct } from "@commerce/AITools/AskTheProduct";
import { catalogOptimizationAgent } from "@commerce/AIAgents/catalogOptimizationAgent";

export const moduleMapping: Record<string, any> = {
 //createAccountSummary,
  // summarizeSalesOppotunity,
  // personalizedProspectingEmail,
  // generateQuestionForDiscoveryCall,
  // writeCaseOverview,
  // writeCustServiceResponse,
  // createKnowledgeBasedArticle,
  // SummaryOfProductReviews,
  // Meetings,
  // Scheduling,
  // generateBlogPost,
  // createSocialMediaPost,
  // generateProductBannerTxt,
  // AskTheProduct,
  // ProductDescription,
  // VisualSearch,
  // ProductAttributes,
  // IntelligentQA,
  // Settings,
  // AIToolsBuilder,
  // SmartActions,
  catalogOptimizationAgent
};
