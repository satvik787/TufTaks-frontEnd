import {Editor} from "@monaco-editor/react";
import {Button, Dropdown, Grid, GridColumn, GridRow, Input, Loader} from "semantic-ui-react"
import StdIO from "../StdIO.jsx";
import {useState} from "react";
import Navbar from "../Navbar.jsx";
import {executeCode,getOutput} from "../api.js";
import { toast } from "sonner";
import {submit} from "../api.js";
import {useNavigate} from "react-router-dom";


const themeList = [
    {
        key: 'Light',
        text: 'Light',
        value: 'light',
    },
    {
        key: "Dark",
        text: "Dark",
        value:"vs-dark"
    }
]
const languageList = [
    {
        key: "C++",
        text: "C++",
        value:54,
    },
    {
        key: "Java",
        text: "Java",
        value:91
    },
    {
        key: "Python 3",
        text: "Python 3",
        value:71
    },
    {
        key: "JavaScript",
        text: "JavaScript",
        value:93
    }
]
const idToName = {54:"cpp",91:"java",71:"python",93:"javascript"};
export default function EditorPage(){
    const [theme,setTheme] = useState("light  ");
    const [language,setLanguage] = useState(54);
    const [code,setCode] = useState("");
    const [input,setInput] = useState("");
    const [output,setOutput] = useState({});
    const [loading,setLoading] = useState(false);
    const [userName,setUserName] = useState("");
    const navigate = useNavigate();
    function handleRun(){
        setLoading(true);
        executeCode(language,code,input).then((res)=>{
            if(res.ok){
                toast.success("Code Submitted successfully")
                getOutput().then((res)=>{
                    if(res.err){
                        setLoading(false);
                        toast.error(res.err);
                    }else{
                        if(res.resolved){
                            setLoading(false);
                            setOutput(res.obj);
                        }else{
                            setTimeout(()=>getOutput(),2000);
                        }
                    }
                }).catch((err)=>{
                    console.log(err);
                    toast.error("Internal Error");
                })
            }else{
                setLoading(false);
                if(res.err){
                    console.log(res.err)
                    toast.error(res.err);
                }
            }
        }).catch((err)=>{
            setLoading(false);
            console.log(err);
            toast.error("Internal Err");
        })
    }


    function handleSubmit(){
        if(userName.trim().length < 3){
            toast.warning("userName has to be at least 3 character long");
            return;
        }
        if(code.trim().length === 0){
            toast.warning("Source code cannot be empty");
            return;
        }
        submit({userName,code,language:idToName[language],stdin:input,output:output.output || " "})
            .then((res)=>{
                if(res.ok){
                    if(res.data.affectedRows >= 1){
                        navigate('/submission')
                    }else{
                        toast.error("Failed to submit");
                    }
                }else{
                    toast.error(res.err);
                }
            });
    }

    return (
        <>
            <Navbar/>
            <Grid >
                <GridColumn width={4} verticalAlign={"bottom"} style={{paddingRight:0}}>
                    <GridRow >
                        <div style={{marginBottom:"16px"}}>
                            <label >UserName:</label>
                            <Input style={{width:"100%"}} placeholder={"userName"} value={userName} onChange={(e)=>setUserName(e.target.value)}></Input>
                            <br/>
                        </div>
                        <div style={{marginBottom:"16px"}}>
                            <label>Input:</label>
                            <StdIO value={input} onChangeHandler={(c)=>{setInput(c.target.value)}} readOnly={false}/>
                        </div>
                        <div style={{marginBottom:"16px"}}>
                            <div><p>Output: </p>  <Loader active={loading} size={'small'} inline></Loader></div>
                            <StdIO value={output.output ? output.output:""} style={{color:output.err ? "red":"black"}} readOnly={true}/>
                        </div>
                        <div style={{marginTop:"32px",width:"100%",display:"flex",justifyContent:"space-between"}}>
                            <Button disabled={loading} style={{marginRight:"16px"}} fluid color={"teal"} onClick={handleRun}>Run</Button>
                            <Button fluid color={"green"} onClick={handleSubmit}>Submit</Button>
                        </div>
                    </GridRow>
                </GridColumn>
                <GridColumn width={12} verticalAlign={"bottom"}>
                    <GridRow>
                        <div style={{width:"100%",display:"flex",justifyContent:"space-between"}}>
                            <Dropdown
                                style={{width:"100%",padding:"16px",margin:"0 8px 8px 0"}}
                                selection
                                placeholder={"Select Language"}
                                options={languageList}
                                value={language}
                                onChange={(e,t)=>{
                                    setCode("");
                                    setLanguage(t.value)}
                                }
                            />
                            <Dropdown
                                style={{width:"100%",padding:"16px",margin:"0 0 8px 0"}}
                                selection
                                options={themeList}
                                defaultValue={"light" }
                                placeholder={"Select Theme"}
                                onChange={(e,t)=>{setTheme(t.value)}}
                            />
                        </div>
                    </GridRow>
                    <Editor
                        width={"100%"}
                        height={"75vh"}
                        theme={theme}
                        value={code}
                        language={idToName[language]}
                        onChange={(code)=>setCode(code)}
                    />
                </GridColumn>
            </Grid>
        </>
    )
}