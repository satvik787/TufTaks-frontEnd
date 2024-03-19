import {Container, Menu, Image} from "semantic-ui-react";
import {useNavigate} from "react-router-dom";
import logo from "./assets/logo.png"
export default function Navbar(){
    const navigate = useNavigate();
    return (
        <Menu style={{margin:"0 0 16px 0"}}>
            <Container>
                <Menu.Item as='a' header onClick={()=>navigate("/")}>
                    <Image size='mini' src={logo} />
                </Menu.Item>
                <Menu.Item as='a' onClick={()=>navigate("/submission")}>Submission</Menu.Item>
            </Container>
        </Menu>

    );
}