import type React from "react";
import FollowerLists from "../FollowerLists/FollowerLists";
import { followerData } from "@/data";
import { rightArrow } from "@/utils/assets";
import Form from "./Form";
export default function ContactForm() {

    return (
        <div className="grid grid-cols-1 gap-5 w-full mb-6">

            {/* Form Section */}
            <Form />

            {/* Follower List Section */}
            {/* <FollowerLists followerData={followerData} rightArrow={rightArrow} /> */}

        </div>
    );
}
