import { useEffect, useState } from "react";
import "./Styles/websitesList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WebsiteCard from "./websiteCard";
import { url } from "inspector";
import plusImag from "../Media/plus.png";

export interface Website {
    id: string;
    interval: number;
    latency: number;
    name: string;
    url: string;
}

// A Websites List function component responsible for presenting all the websites.
function WebsitesList() {

    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getWebsitesList = async () => {
        const req_url = "http://localhost:3001/websites";
        const res = await axios.get(req_url)
        setWebsites(res.data);
        setIsLoading(false);
    };
    
    useEffect(() => {
        getWebsitesList();
    }, []);


    return (
        <div className="websites-container">
            {
                isLoading ?
                (
                    <div> Loading websites list data from the server... </div>
                )
                :
                (
                    <div className="cards">
                        {websites.map((website: Website) => (
                            <WebsiteCard key={website.id} website={website}/>
                        ))}
                        <div className="plus">
                            <img className="plus-img" src={plusImag}  alt="plus" />
                        </div>
                    </div>
                )
            }
        </div>
    );
  }
  
  export default WebsitesList;
  