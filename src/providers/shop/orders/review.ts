import gql from 'graphql-tag';
import {
	GetPurchasedVariantForReviewResult,
	SubmitProductReviewInput,
} from '~/generated/graphql-shop';
import { shopSdk } from '~/graphql-wrapper';

export const submitProductReviewMutation = async (input: SubmitProductReviewInput) => {
	return await shopSdk.submitProductReview({ input }).then((res) => res.submitProductReview);
};

export const getPurchasedVariantForReviewQuery =
	async (): Promise<GetPurchasedVariantForReviewResult> => {
		return await shopSdk
			.getPurchasedVariantForReviewQuery()
			.then((res) => res.getPurchasedVariantForReview);
	};

export const isReviewAllowedQuery = async (productVariantId: string) => {
	return await shopSdk.isReviewAllowed({ productVariantId }).then((res) => res.isReviewAllowed);
};

gql`
	mutation submitProductReview($input: SubmitProductReviewInput!) {
		submitProductReview(input: $input) {
			... on ProductReview {
				__typename
				id
				state
			}
			... on ReviewSubmissionError {
				__typename
				errorCode
				message
			}
		}
	}
`;

gql`
	query getPurchasedVariantForReviewQuery {
		getPurchasedVariantForReview {
			... on PurchasedVariantWithReviewStatusList {
				__typename
				items {
					variantId
					canReview
					notReviewableReason
				}
			}
			... on ErrorResult {
				__typename
				errorCode
				message
			}
		}
	}
`;

gql`
	query isReviewAllowed($productVariantId: ID!) {
		isReviewAllowed(productVariantId: $productVariantId) {
			... on PurchasedVariantWithReviewStatus {
				__typename
				variantId
				canReview
				notReviewableReason
			}
			... on ErrorResult {
				__typename
				errorCode
				message
			}
		}
	}
`;
