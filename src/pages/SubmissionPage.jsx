import {useEffect, useState} from "react";
import {submission} from "../api.js";
import {toast} from "sonner";
import {
    Button,
    Card, Modal, ModalContent, Pagination,
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import Navbar from "../Navbar.jsx";

export default function SubmissionPage(){
    const [page,setPage] = useState(1);
    const [submissions,setSubmissions] = useState([]);
    const [index,setIndex] = useState(-1);
    const [totalPages,setTotalPages] = useState(0);
    useEffect(() => {
        submission(page).then((res)=>{
            if(res.ok){
                setSubmissions(res.data.rows);
                setTotalPages(res.data.totalPages);
            }else{
                toast.error(`Something Went Wrong ${res.err}`)
            }
        })
    }, [page]);
    const rows = submissions.map((val,index)=>{
        const timestamp = new Date(val.submittedOn);
        return (
            <TableRow key={val.id} >
                <TableCell >{val.userName}</TableCell>
                <TableCell >{val.language}</TableCell>
                <TableCell data-ind={index} selectable onClick={(e)=>{setIndex(e.target.getAttribute('data-ind'))}}>{val.code.slice(0,100)}</TableCell>
                <TableCell >{val.stdin}</TableCell>
                <TableCell>{val.output}</TableCell>
                <TableCell>{timestamp.toLocaleDateString() + "  " + timestamp.toLocaleTimeString()}</TableCell>
            </TableRow>
        )
    })
    return (
        <>
            <Navbar/>
            <Modal open={index !== -1} size={"large"}>
                <ModalContent >
                    <div style={{display:"flex",justifyContent:"end",marginBottom:"4px"}}>
                        <Button compact icon={'close'} onClick={()=>setIndex(-1)}/>
                    </div>
                    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center"}}>
                        <textarea value={index !== -1 && index < submissions.length ? submissions[index].code:""} readOnly style={{width:"100%",padding:"8px",overflow:"auto",minHeight:"50vh",maxHeight:"50vh",resize:"none"}}>

                        </textarea>
                    </div>
                </ModalContent>
            </Modal>
            <div style={{display:"flex",justifyContent:"center"}}>
                <Card style={{width:"80%",padding:"16px"}}>
                    <Table celled size={'small'} >
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell textAlign="center" width={2}>UserName</TableHeaderCell>
                                <TableHeaderCell textAlign="center" width={2}>language</TableHeaderCell>
                                <TableHeaderCell textAlign="center" width={4}>code</TableHeaderCell>
                                <TableHeaderCell textAlign="center" width={2}>input</TableHeaderCell>
                                <TableHeaderCell textAlign="center" width={3}>output</TableHeaderCell>
                                <TableHeaderCell textAlign="center" width={3}>submittedOn</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableHeaderCell colSpan='6' >
                                    <Pagination
                                        boundaryRange={0}
                                        ellipsisItem={null}
                                        firstItem={null}
                                        lastItem={null}
                                        totalPages={totalPages  }
                                        defaultActivePage={1}
                                        onPageChange={(event, data)=>setPage(data.activePage)} >
                                    </Pagination>
                                </TableHeaderCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Card>
            </div>
        </>
    )
}