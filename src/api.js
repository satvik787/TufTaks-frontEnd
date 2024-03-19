import axios from "axios";

const SUBMISSION_TOKEN = "TOKEN"
export async function executeCode(langId,code,stdInput){
    if(localStorage.hasOwnProperty(SUBMISSION_TOKEN) || code.trim().length === 0)return {ok:false};
    const options = {
        method: 'POST',
        url: import.meta.env.VITE_APP_SUBMISSION_URL,
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': import.meta.env.VITE_APP_RAPID_API_KEY,
            'X-RapidAPI-Host': import.meta.env.VITE_APP_RAPID_API_HOST
        },
        data: {
            language_id: langId,
            source_code:btoa(code),
            stdin:btoa(stdInput)
        }
    };
    return axios.request(options)
        .then((res)=>{
            if(res.status === 201){
                localStorage.setItem(SUBMISSION_TOKEN,res.data.token);
                return {ok:true,msg:"code submitted successfully"}
            }else{
                return {ok:false,err:"CODE EXECUTION FAILED"}
            }
        }).catch((err)=>{
            return {ok:false,err}
        }
    )
}
export async function getOutput() {
    if (!localStorage.hasOwnProperty(SUBMISSION_TOKEN)) return {err:"no token"};
    const options = {
        method: "GET",
        url: import.meta.env.VITE_APP_SUBMISSION_URL + localStorage.getItem(SUBMISSION_TOKEN),
        params: {
            base64_encoded: "true",
        },
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_APP_RAPID_API_KEY,
            'X-RapidAPI-Host': import.meta.env.VITE_APP_RAPID_API_HOST
        }
    };
    return axios.request(options)
        .then((res) => {
            if (res.data.status.id !== undefined) {
                if (res.data.status.id === 1 || res.data.status.id === 2) {
                    return {resolved:false}
                } else {
                    let obj = null;
                    if (res.data.status.id <= 4) {
                        obj = {err: false, output: res.data.stdout !== null ? atob(res.data.stdout) : ""}
                    } else if (res.data.status.id === 5) {
                        obj = {err: true, output: "Time Limited Exceeded"}
                    } else if (res.data.status.id === 6) {
                        obj = {err: true, output: res.data.compile_output !== null ? atob(res.data.compile_output) : ""}
                    } else {
                        obj = {err: true, output: res.data.stderr !== null ? atob(res.data.stderr) : ""}
                    }
                    localStorage.removeItem(SUBMISSION_TOKEN);
                    return {resolved:true,obj}
                }
            } else {
                localStorage.removeItem(SUBMISSION_TOKEN);
                return {err:"Request Failed"}
            }
        }).catch((err) => {
            localStorage.removeItem(SUBMISSION_TOKEN);
            return {err:err}
        }
    );
}

async function request(url,method,{data={},query={}}){

    const options = {
        method: method,
        url: url,
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
        },
        data:data,
        params:query
    };
    return axios.request({
        url,method,...options
    }).then((res)=>{
        if(res.status === 200){
            return {ok:true,data:res.data}
        }
        return {ok:false,err:res.statusText + "\n" + res.data}
    }).catch((err)=>{
        return {ok:false,err:err.message};
    })
}
export async function submit(obj){
    return await request(import.meta.env.VITE_APP_API_SUBMIT_URL,"POST",{data:{...obj}});
}

export async function submission(page){
    return await request(import.meta.env.VITE_APP_API_SUBMISSION_URL,"GET",{query:{page}});
}
