import { Page } from '@playwright/test';

import { SmartActions } from '@sales/SmartActions';
import { createAccountSummary } from '@sales/AITools/createAccountSummary';
import { summarizeSalesOppotunity } from '@sales/AITools/summarizeSalesOpportunity';
import { personalizedProspectingEmail } from '@sales/AITools/personalizedProspectingEmail';
import { generateQuestionForDiscoveryCall } from '@sales/AITools/generateQuestionsDiscoveryCall';
import { writeCaseOverview } from '@sales/AITools/writeCaseOverview';
import { writeCustServiceResponse } from '@sales/AITools/writeCustomerServiceResponse';
import { createKnowledgeBasedArticle } from '@sales/AITools/createKnowledgeBasedArticle';
import { SummaryOfProductReviews } from '@sales/AITools/SummaryofProductReviews';

import { generateBlogPost } from '@commerce/AITools/generateBlogPost';
import { createSocialMediaPost } from '@commerce/AITools/createSocialMediaPost';
import { generateProductBannerTxt } from '@commerce/AITools/generateProductBannerText';
import { AskTheProduct } from '@commerce/AITools/AskTheProduct';
import { ProductDescription } from '@commerce/ProductDescription';
import { ProductAttributes } from '@commerce/ProductAttributes';

import { IntelligentQA } from '@core/IntelligentQA';

// ✅ Registry definition
export const toolRegistry: Record<
  string,
  { class: new (page: Page) => any; method: string }
> = {
  createAccountSummary: {
    class: createAccountSummary,
    method: 'createAccountSummary',
  },
  summarizeSalesOppotunity: {
    class: summarizeSalesOppotunity,
    method: 'summarizeSalesOppotunity',
  },
  personalizedProspectingEmail: {
    class: personalizedProspectingEmail,
    method: 'personalizedProspectingEmail',
  },
  generateQuestionForDiscoveryCall: {
    class: generateQuestionForDiscoveryCall,
    method: 'generateQuestionForDiscoveryCall',
  },
  writeCaseOverview: {
    class: writeCaseOverview,
    method: 'writeCaseOverview',
  },
  writeCustServiceResponse: {
    class: writeCustServiceResponse,
    method: 'writeCustServiceResponse',
  },
  createKnowledgeBasedArticle: {
    class: createKnowledgeBasedArticle,
    method: 'createKnowledgeBasedArticle',
  },
  generateBlogPost: {
    class: generateBlogPost,
    method: 'generateBlogPost',
  },
  createSocialMediaPost: {
    class: createSocialMediaPost,
    method: 'createSocialMediaPost',
  },
  generateProductBannerTxt: {
    class: generateProductBannerTxt,
    method: 'generateProductBannerTxt',
  },
  AskTheProduct: {
    class: AskTheProduct,
    method: 'AskTheProduct',
  },
  ProductDescription: {
    class: ProductDescription,
    method: 'ProductDescriptionChromeExtension',
  },
  ProductAttributes: {
    class: ProductAttributes,
    method: 'ProductAttributesChromeExtension',
  },
  SummaryOfProductReviews: {
    class: SummaryOfProductReviews,
    method: 'SummaryOfProductReviews',
  },
  IntelligentQA: {
    class: IntelligentQA,
    method: 'IntelligentQA',
  },
  SmartActions: {
    class: SmartActions,
    method: 'SmartActionschromeExtension',
  },
};
