import gql from 'graphql-tag';
import { SubmitProductReviewInput } from '~/generated/graphql-shop';
import { shopSdk } from '~/graphql-wrapper';

export const submitProductReviewMutation = async (input: SubmitProductReviewInput) => {
	return await shopSdk.submitProductReview({ input }).then((res) => res.submitProductReview);
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
