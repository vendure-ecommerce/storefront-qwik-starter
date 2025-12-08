import gql from 'graphql-tag';
import {
	GetPurchasedVariantForReviewResult,
	ProductReviewListOptions,
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

export const getReviewHistogramQuery = async (productId: string) => {
	return await shopSdk
		.getReviewHistogram({ productId })
		.then((res) => res.product?.reviewsHistogram);
};

/**
 *
 * @param id product.id
 * @param options e.g.
 * {
 *		"skip": 0,
 *		"take": 10,
 *		"filter": { "state": { "eq": "approved" } }
 *	}
 * @returns
 */
export const getProductReviewsQuery = async (id: string, options?: ProductReviewListOptions) => {
	return await shopSdk.getProductReviews({ id, options }).then((res) => res.product?.reviews);
};

/**
 * @param vote true for upvote, false for reverting the previous upvote
 * @returns
 */
export const voteOnReviewMutation = async (id: string, vote: boolean) => {
	return await shopSdk.voteOnReview({ id, vote }).then((res) => res.voteOnReview);
};

/**
 *
 * @param productIds
 * @returns
 * { items: [
 *     productId
 *     reviewCount
 *     reviewRating
 *   ]
 * }
 */
export const getReviewRatingsForProductsQuery = async (productIds: string[]) => {
	return await shopSdk
		.getReviewRatingsForProducts({ productIds })
		.then((res) => res.getReviewRatingsForProducts);
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

gql`
	query getProductReviews($id: ID!, $options: ProductReviewListOptions) {
		product(id: $id) {
			id
			reviews(options: $options) {
				items {
					id
					productVariant {
						id
						name
					}
					rating
					summary
					body
					rating
					authorName
					authorLocation
					createdAt
					upvotes
					assets {
						id
						preview
						focalPoint {
							x
							y
						}
					}
					response
					responseCreatedAt
				}
				totalItems
			}
		}
	}
`;

gql`
	query getReviewHistogram($productId: ID!) {
		product(id: $productId) {
			id
			reviewsHistogram {
				bin
				frequency
			}
		}
	}
`;

gql`
	mutation voteOnReview($id: ID!, $vote: Boolean!) {
		voteOnReview(id: $id, vote: $vote) {
			... on Success {
				__typename
				success
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
	query getReviewRatingsForProducts($productIds: [ID!]!) {
		getReviewRatingsForProducts(productIds: $productIds) {
			... on ProductReviewRatingList {
				__typename
				items {
					productId
					reviewCount
					reviewRating
				}
			}
			... on GetReviewRatingsForProductsError {
				__typename
				errorCode
				message
			}
		}
	}
`;
