import { useEffect, useState } from "react";
import "./Styles/addOrUpdateForm.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// A form function component responsible for adding new cards or updating existing ones.
function AddOrUpdateForm() {

    const location = useLocation();
    const { formType, id } = location.state;
    const isAddForm = formType === "add" ? true : false;
    const [title, setTitle] = useState("");
    const [submitText, setSubmitText] = useState("");
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [disable, setDisable] = useState(false);
    const navigator = useNavigate();

    useEffect(()=> {
        if (isAddForm) {
            setTitle("Add a website card!");
            setSubmitText("Add!")
        }
        else {
            setTitle("Update a website card!");
            setSubmitText("Update!")
        }
        }, []);

    const handleNameChange = (event: any): void => {
        setName(event.target.value);
    };
    const handleUrlChange = (event: any): void => {
        setUrl(event.target.value);
    };

    const handleAddSubmit = async (e: any) => {
        e.preventDefault();
        setDisable(true);
        setSubmitText("Loading...")
        axios.post("http://localhost:3001/addWebsite", { name: name, url: url }).then(res => {
            navigator("/");
        }).catch((err) => {
            console.log(`There is a problem - \n ${err}`);
            setDisable(false);
        });
    };

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        setDisable(true);
        setSubmitText("Loading...")
        if (name === "" && url === "") {
            alert("Please change at least one field when updating a website");
            setSubmitText("Update!")
            return;
        }
        axios.put(`http://localhost:3001/updateWebsite/${id}`, { name: name, url: url }).then(res => {
            navigator("/");
        }).catch((err) => {
            console.log(`There is a problem - \n ${err}`);
            setDisable(false);
        });
    };

    return (
        <div className="form-container">
            <h1>{title}</h1>
            <form className="form" onSubmit={isAddForm ? handleAddSubmit : handleUpdateSubmit}>
                <input type="text" placeholder="Name" required={isAddForm} onChange={handleNameChange} />
                <input type="text" placeholder="Url" required={isAddForm} onChange={handleUrlChange} />
                <input type="submit" value={submitText} disabled={disable} />
            </form>
        </div>
    );
  }
  
  export default AddOrUpdateForm;
  