import { useEffect, useState } from "react";
import "./Styles/websitesList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WebsiteCard from "./websiteCard";
import plusImag from "../Media/plus.png";

export interface Website {
    id: string;
    latency: number;
    name: string;
    url: string;
}

// A Websites List function component responsible for presenting all the websites.
function WebsitesList() {

    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [green, setGreen] = useState(190);
    const [orange, setOrange] = useState(350);
    const navigator = useNavigate();

    const getWebsitesList = async () => {
        const req_url = "http://localhost:3001/websites";
        const res = await axios.get(req_url)
        setWebsites(res.data);
        setIsLoading(false);
    };

    const addFormNav = () => {
        navigator("/form", { state: { formType: "add" } })
    };

    const deleteCard = async (id: number) => {
        axios.delete(`http://localhost:3001/deleteWebsite/${id}`).then(res => setWebsites(res.data));       // Wanted to demonstrate the use of both "async/await" and ".then"
    };

    const handleGreenChange = (event: any): void => {
        const greenValue = parseInt(event.target.value);
        if (greenValue >= orange) {
            alert("The threshold for the green indicator cannot be higher than or equal to the orange one");
            event.target.value = green;
            return;
        }
        setGreen(greenValue);
    };

    const handleOrangeChange = (event: any): void => {
        const orangeValue = parseInt(event.target.value);
        if (orangeValue <= green) {
            alert("The threshold for the orange indicator cannot be lower than or equal to the green one");
            event.target.value = orange;
            return;
        }
        setOrange(orangeValue);
    };
    
    useEffect(() => {
        getWebsitesList();
    }, []);

    return (
        <div className="all-container">
            {
                isLoading ?
                (
                    <h1> Loading websites list data from the server... </h1>
                )
                :
                (
                    <div className="setting-cards">
                        <div className="settings">
                            <div className="traffic-lights-settings">
                                <label htmlFor="green">Input the highest threshold latency for the GREEN indicator (in ms):</label>
                                <input id="green" className="traffic-lights-input" type="number" defaultValue={190} onChange={handleGreenChange} />
                                <label htmlFor="orange">Input the highest threshold latency for the ORANGE indicator (in ms):</label>
                                <input id="orange" className="traffic-lights-input" type="number" defaultValue={350} onChange={handleOrangeChange} />
                            </div>
                        </div>
                        <div className="cards">
                            {websites.map((website: Website) => (
                                <WebsiteCard key={website.id} website={website} delFunc={deleteCard} green={green} orange={orange}/>
                            ))}
                            <div className="plus">
                                <img className="plus-img" src={plusImag} alt="plus" onClick={addFormNav}/>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
  }
  
  export default WebsitesList;
  