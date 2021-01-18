import React, {Component} from 'react'

class Channel extends Component {

    constructor(props)
    {
        super(props)
    }

    render(){
        const { match } = this.props
        console.log(match)
        return(
            <div style={{height: "100vh", width: "100vw" ,backgroundColor: "#fff;", display:"flex", flexDirection:"row-reverse"}}>
        <iframe style={{display:"block", width: "80%", height:"100%", overflowY: "auto", overflowX:"hidden"}} src="https://open.rocket.chat/channel/general?layout=embedded" />
      </div>
        )
    }
}

export default Channel