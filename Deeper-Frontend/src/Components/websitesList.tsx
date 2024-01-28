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
    const [interval, setInterval] = useState(1);
    const [intervalText, setIntervalText] = useState(1);
    const navigator = useNavigate();

    const getWebsitesList = async () => {
        try {
            const req_url = "http://localhost:3001/websites";
            const res = await axios.get(req_url)
            setWebsites(res.data);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const getTimeInterval = async () => {
        try {
            const res = await axios.get("http://localhost:3001/interval");
            setInterval(res.data);
            setIntervalText(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const setTimeInterval = async (e: any) => {
        try {
            e.preventDefault();
            const res = await axios.put("http://localhost:3001/interval", { timeInterval: interval });
            setInterval(res.data);
            setIntervalText(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const addFormNav = () => {
        navigator("/form", { state: { formType: "add" } })
    };

    const deleteCard = async (id: number) => {
        axios.delete(`http://localhost:3001/deleteWebsite/${id}`).then(res => setWebsites(res.data)).catch(e => console.log(e));  // Wanted to demonstrate the use of both "async/await" and ".then"
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

    const handleIntervalChange = (event: any): void => {
        const intervalValue = parseInt(event.target.value);
        if (intervalValue > 59 || intervalValue < 1) {
            alert("Please select an interval of 1-59 minutes.");
            event.target.value = interval;
            return;
        }
        setInterval(intervalValue);
    };
    
    useEffect(() => {
        getWebsitesList();
        getTimeInterval();
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

                            <form className="latency-settings" onSubmit={setTimeInterval}>
                                <span>{`Current time interval for latency checks: Every ${intervalText} minutes of the hour. To set a new interval:`}</span>
                                <input className="interval-input" type="number" placeholder="New interval" onChange={handleIntervalChange} />
                                <input className="interval-button" type="submit" value="Set time interval" />
                            </form>
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
  