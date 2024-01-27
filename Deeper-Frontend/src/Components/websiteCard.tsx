import "./Styles/websiteCard.css";
import { useNavigate } from "react-router-dom";
import { Website } from "./websitesList";
import deleteImg from "../Media/delete.png";
import editImg from "../Media/edit.png";

interface WebsiteCardProps {
    website: Website;
    delFunc: any;
    green: number;
    orange: number;
}

// A Website Card function component responsible for presenting a website in details.
function WebsiteCard(props: WebsiteCardProps) {

    const navigator = useNavigate();
    const id = props.website.id;
    const name = props.website.name;
    const url = props.website.url;
    const latency = props.website.latency;
    const green = props.green;
    const orange = props.orange;

    const updateFormNav = () => {
        navigator("/form", { state: { formType: "update", id: id } });
    };

    return (
            <div className="website-card">
                <span>ID: {id}</span>
                <span>Name: {name}</span>
                <span>Url: {url}</span>
                <span>Latency: {latency ? `${latency} ms` : "Connection refused"}</span>
                <div className="buttons-container">
                    <img className="buttons" src={editImg} alt="edit" onClick={updateFormNav} />
                    <img className="buttons" src={deleteImg} alt="delete" onClick={() => props.delFunc(id)} />
                </div>
                { latency && (
                <div className={`traffic-light ${latency <= green ? "green-circle" : (latency >= green + 1 && latency <= orange) ? "orange-circle" : "red-circle" }`}  />
                )
                }
            </div>
        )
    }
  
  export default WebsiteCard;
  