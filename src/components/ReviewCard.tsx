import React, { useState } from "react";
import { IReview } from '../models/IReview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faExternalLinkAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import ReviewEditor from "./ReviewEditor";
import { Link } from "react-router-dom";
import Chip from "../elements/Chip";

interface ReviewCardProps {
    review: IReview,
    selectFn: Function,
    className: string
}

export default function ReviewCard({ className, review, selectFn }: ReviewCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return <ReviewEditor review={review} closeFn={() => setIsEditing(false)} />
    }

    return (
        <div className={["review-card bg-white rounded-2xl shadow-lg p-8", className].join(' ')}>
            <div className="flex flex-row items-stretch">
                <div className="mr-8 flex flex-col">
                    <input className=" cursor-pointer mb-auto" data-testid="review-checkbox" type="checkbox" onChange={(e) => selectFn(e.target.checked, review)} />
                    <span className="cursor-pointer" onClick={() => setIsEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} className="text-secondary hover:text-primary" />
                    </span>
                    <Link className="cursor-pointer" to={"/review/" + review?.id}>
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="text-danger hover:text-primary" />
                    </Link>

                </div>
                <div className="flex-1">
                    <header className="flex flex-row items-start justify-between mb-4">
                        <div>
                            <div className="flex flex-row items-center mb-2">
                                <Chip className={["mr-2", review.isDraft ? "bg-warning" : "bg-success"].join(' ')}>
                                    { review.isDraft ? "Draft" : "Published" }
                                </Chip>
                                <Chip>{ review?.book.category }</Chip>
                            </div>
                            <h3 className="text-primary text-2xl font-bold ">{review?.book.title}</h3>
                        </div>
                        <p className="text-lg text-secondary font-bold ">
                            <FontAwesomeIcon className="mr-2" icon={faStar} />
                            {review?.rating}/5
                        </p>
                    </header>
                    <p id="subheader" className="tracking-wider text-gray-400">{review?.book.description}</p>
                    <hr className="my-4" />
                    <p className="tracking-wider">
                        {review?.statement}
                    </p>
                </div>
            </div>
        </div>
    )
}