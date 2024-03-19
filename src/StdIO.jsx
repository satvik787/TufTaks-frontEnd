// eslint-disable-next-line react/prop-types
export default function StdIO({onChangeHandler,value,readOnly,style={}}){
    return (
        <textarea
            readOnly={readOnly}
            value={value}
            style={{borderRadius:"4px",padding:"8px",width:"100%",resize:"none",minHeight:"140px",...style}}
            onChange={onChangeHandler}
        />
    )
}