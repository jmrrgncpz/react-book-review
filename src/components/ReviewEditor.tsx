import React, { useContext } from 'react';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "react-query";
import { IReview } from "../models/IReview";
import { useForm } from 'react-hook-form';
import ValidationText from '../elements/ValidationText';
import { submit } from '../services/ReviewService';
import { toast, ToastContainer } from 'react-toastify';
import CategoriesSelect from '../elements/CategoriesSelect';
import FeedContext from "../services/FeedContext";

interface IReviewEditorProps {
    review?: IReview | null;
    className?: string;
    closeFn: Function,
}

export default function ReviewEditor({ className, review, closeFn }: IReviewEditorProps) {
    const feedFilter: any = useContext(FeedContext);
    const queryClient = useQueryClient();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const isDraft = watch("isDraft");

    const { mutateAsync, isLoading, isSuccess } = useMutation((newReview: IReview) => submit(newReview), {
        onMutate: async newReview => {
            const queryKey = ['reviews', feedFilter];

            await queryClient.cancelQueries(queryKey);
            const previousReviews = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(queryKey, (old: any) => [...old, newReview]);

            return { previousReviews, queryKey };
        },
        onError: (err, newReview, context: any) => {
            toast.error("Save failed. Something went wrong.")
            queryClient.setQueryData(context.queryKey, context.previousReviews);
        },
        onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries(context.queryKey);
        }
    })

    const onSubmit = async (data: any): Promise<void> => {
        const tmp_review: IReview = {
            book: {
                title: data.bookTitle,
                description: data.bookDescription,
                category: data.bookCategory
            },
            statement: data.statement,
            rating: parseInt(data.rating),
            isDraft: data.isDraft,
            id: review?.id || null
        }

        await mutateAsync(tmp_review);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={["bg-white rounded-2xl shadow-lg p-8 my-4", className].join(' ')}>
                <h2 className="font-bold text-xs text-primary mb-4">
                    {
                        review ? "Edit Review: " + review.book.title : "New Review"
                    }
                </h2>
                <div className="flex-1">
                    <header className="flex flex-row items-center justify-between mb-4">
                        <div className="mr-8">
                            <label className="flex flex-col">
                                <span className="text-sm text-primary">Book title</span>
                                <input
                                    defaultValue={review?.book.title || ""}
                                    className="shadow-inner mb-2  border border-gray-200 p-2 rounded text-primary text-2xl font-bold outline-none"
                                    {...register("bookTitle", { required: true })} />
                            </label>
                            {errors.bookTitle && <ValidationText text="Book title is required" />}
                        </div>


                        <p className="text-lg text-secondary font-bold border-b border-secondary">
                            <FontAwesomeIcon className="mr-2" icon={faStar} />
                            <input type="number" max="5" min="1" defaultValue={review?.rating || 5} placeholder="Rating" {...register("rating", { required: true })} />
                        </p>
                    </header>
                    <CategoriesSelect className="mb-4" category={review?.book.category} register={register} />
                    <label className="flex flex-col">
                        <span className="text-sm text-primary">Book description</span>
                        <textarea
                            className=" outline-none w-full shadow-inner border border-gray-200 p-2 rounded tracking-wider"
                            defaultValue={review?.book.description || ""}
                            {...register('bookDescription', { required: true })} />
                    </label>


                    {errors.bookDescription && <ValidationText text="Book description is required" />}
                    <hr className="my-4" />
                    <div id="review-statement" className="mb-4">
                        <label className="flex flex-col">
                            <span className="text-sm text-primary">Review</span>
                            <textarea
                                className=" outline-none w-full shadow-inner border border-gray-200 p-2 rounded tracking-wider"
                                defaultValue={review?.statement || ""}
                                {...register('statement', { required: true })} />
                        </label>

                        {errors.statement && <ValidationText text="Review statement is required" />}
                    </div>

                    <label className="cursor-pointer">
                        <input type="checkbox" className="mr-4" defaultChecked={review?.isDraft} {...register('isDraft')} />
                        Draft
                    </label>
                </div>
                <div id="actions-container" className="mt-12 flex flex-row justify-end">

                    <button className="bg-transparent text-secondary font-bold" disabled={isLoading} onClick={() => closeFn()}>
                        {
                            isSuccess ? "Close" : 'Cancel'
                        }
                    </button>
                    {
                        <input
                            type="submit"
                            value={
                                isSuccess
                                    ? isDraft ? "Draft saved" : "Review published"
                                    : isLoading ? "Saving" : "Submit"
                            }
                            className={["ml-8 text-white py-2 px-8 rounded shadow font-bold",
                                isSuccess
                                    ? "cursor-not-allowed bg-success"
                                    : isLoading
                                        ? "cursor-not-allowed bg-primary"
                                        : "cursor-pointer bg-primary"
                            ].join(' ')}
                        />
                    }
                </div>
            </div>
            <ToastContainer />
        </form>
    )
}