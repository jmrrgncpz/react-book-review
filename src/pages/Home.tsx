import axios from '../axios';
import { useQuery, useMutation, useQueryClient } from "react-query"
import { ToastContainer, toast } from "react-toastify"
import Feed from '../components/Feed';
import ReviewEditor from '../components/ReviewEditor';
import { useState } from 'react';
import { submit } from '../services/ReviewService';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReviewCard from '../components/ReviewCard';
import ReviewPreview from '../components/ReviewPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
    const [isEditing, setIsEditing] = useState(false)
    const queryClient = useQueryClient();
    const isFirstTimeMutation = useMutation((isFirstTime: Boolean) => axios.put('/is-first-time', { isFirstTime }),
        {
            onSuccess: (isFirstTime: any) => queryClient.setQueryData('isFirstTime', isFirstTime)
        });

    const onStartClicked = () => {
        isFirstTimeMutation.mutate(false);
    }

    const { isLoading, isError, data } = useQuery("isFirstTime", async () => {
        return axios.get("/is-first-time")
            .then(res => res.data)
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <FontAwesomeIcon size="3x" className="text-primary" spin icon={faSpinner} />
            </div>
        )
    }

    if (isError) {
        return (

            <p>Something went wrong.</p>
        )
    }

    return data.isFirstTime ? (
        <main id="landing" className="bg-primary flex h-screen">
            <div className="w-1/2 m-auto">
                <p className="text-white leading-loose">
                    <span className="text-9xl font-bold cursor-pointer hover:text-secondary" onClick={onStartClicked}>Review</span><br />
                    <span className="text-5xl">the books you</span><br />
                    <span className="text-5xl italic tracking-widest">loved.</span>
                </p>
            </div>
        </main>
    ) :
        (
            <>
                <div id="home" className="flex bg-primary min-h-screen justify-center">
                    <div className="flex flex-col xl:flex-row w-full lg:w-3/4 2xl:w-1/2 p-8 2xl:p-0  items-start xl:justify-center xl:mt-24">
                        <aside className="
                            text-white xl:text-primary
                            xl:bg-white 
                            xl:rounded-2xl 
                            xl:shadow-lg
                            w-full xl:w-1/4
                            xl:p-8 mb-8 2xl:mb-0 
                            flex flex-row justify-between items-center xl:grid grid-cols-1 xl:space-y-8 mr-8">
                            <h2 className="text-3xl font-bold">Welcome, you!</h2>
                            <button onClick={() => setIsEditing(true)} className=" bg-primary py-2 px-8 rounded font-bold text-white shadow">New Review</button>
                        </aside>
                        <Feed className="w-full xl:w-1/2 2xl:w-3/4" />
                    </div>
                    <ToastContainer />
                </div>
                {
                    isEditing ? (
                        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center">
                            <ReviewEditor closeFn={() => setIsEditing(false)} className="m-auto max-h-screen" review={null} />
                        </div>
                    )
                        : null
                }
            </>
        )
}