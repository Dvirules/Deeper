import { useEffect, useState } from "react";
import "./Styles/websiteCard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Website } from "./websitesList";

interface WebsiteCardProps {
    website: Website;
}

// A Website Card function component responsible for presenting a website in details.
function WebsiteCard(props: WebsiteCardProps) {
    return (
            <div className="website-card">
                <span>{props.website.id}</span>
                <span>{props.website.name}</span>
                <span>{props.website.url}</span>
                <span>{props.website.latency}</span>
            </div>
        )
    }
  
  export default WebsiteCard;
  