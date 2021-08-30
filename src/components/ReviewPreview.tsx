import { faChevronLeft, faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Chip from "../elements/Chip";
import Spinner from "../elements/Spinner";
import { getById, _delete } from "../services/ReviewService";

const loadReview = async ({ queryKey }: any) => {
    const [_key, reviewId] = queryKey;

    const review = await getById(reviewId);
    return review;
}

export default function ReviewPreview() {
    const history = useHistory();
    let { id }: any = useParams();
    const { isLoading, isError, data: review } = useQuery(["review", id], loadReview);
    const { mutateAsync: deleteAsync } = useMutation((reviewId: number) => _delete(reviewId), {
        onError: (err, newReview, context: any) => {
            toast.error("Save failed. Something went wrong.")
        },
        onSettled: (data, error, variables, context) => {
            toast.success("Review deleted.")
            history.replace('/');
        }
    })

    const deleteReview = useCallback(async () => {
        await deleteAsync(id)
    }, [review])

    if (isLoading) {
        return (
            <div className="review-preview-container bg-primary h-screen w-screen flex flex-row justify-center items-start">
                <div className="w-1/2 rounded-2xl bg-white shadow-lg m-12 p-8 pb-64 flex flex-row items-start">
                    <Spinner size="3x" />
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <p className="w-3/4 text-white">
                Error loading review
            </p>
        )
    }

    return (
        <div className="review-preview-container bg-primary h-screen w-screen flex flex-row justify-center items-start">
            <div className="w-1/2 rounded-2xl bg-white shadow-lg m-12 p-8 flex flex-col">
                <header className="flex flex-row mb-4">
                    <div className="w-full flex flex-row items-center mb-2">
                        <Link to="/">
                            <span className="cursor-pointer text-primary hover:text-secondary text-2xl mr-4" >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </span>
                        </Link>
                        <h1 className="text-4xl font-bold text-primary">{review?.book.title}</h1>
                    </div>

                    <div className="flex-row flex items-center">
                        <Chip className={["mr-2", review?.isDraft ? "bg-warning" : "bg-success"].join(' ')}>
                            {review?.isDraft ? "Draft" : "Published"}
                        </Chip>
                        <Chip>{review?.book.category}</Chip>
                    </div>
                </header>

                <div className="flex flex-row items-center mb-4">
                    <span className="text-secondary mr-4 font-bold">Rating</span>
                    {Array.from(Array(review?.rating || 5), (e, i) => <FontAwesomeIcon className="text-secondary" icon={faStar} />)}
                    {Array.from(Array(5 - (review?.rating || 5)), (e, i) => <FontAwesomeIcon className="text-gray-200" icon={faStar} />)}
                </div>

                <p className="tracking-wider text-gray-400">
                    {review?.book.description}
                </p>

                <hr className="my-4" />

                <p className="tracking-wider">
                    {review?.statement}
                </p>

                <footer className="mt-8 flex flex-row justify-end">
                    <button className="border border-danger text-danger p-2 rounded hover:bg-red-100 " onClick={deleteReview}>
                        <FontAwesomeIcon className="mr-4" icon={faTrashAlt} />
                        Delete
                    </button>
                </footer>
            </div>
        </div>
    )
}