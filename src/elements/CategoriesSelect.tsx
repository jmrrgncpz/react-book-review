import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useQuery } from "react-query"
import axios from "../axios"
import { getCategories } from "../services/CategoryService";
import Spinner from "./Spinner";

interface Props {
    category: string | undefined,
    register: Function,
    className?: string
}

export default function CategoriesSelect({ className, category, register }: Props) {
    const {
        isLoading,
        isError,
        data: categories
    } = useQuery<string[], Error>("categories", getCategories)

    if (isLoading) {
        return (
            <span className={["border border-gray-200 shadow-sm rounded p-2", className].join(' ')}>
                <Spinner />
            </span>
        )
    }

    if (isError) {
        return (
            <p>Failed loading categories</p>
        )
    }

    return (
        <select className={["border border-gray-200 shadow-sm rounded p-2", className].join(' ')} defaultValue={category}  {...register("bookCategory", { required: true })}>
            {
                categories?.map((c: string) => (
                    <option key={`option-${c}`} value={c}>{c}</option>
                ))
            }
        </select>
    )
}