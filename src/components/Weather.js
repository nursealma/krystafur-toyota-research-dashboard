import React from "react";

class Weather extends React.Component {

    render(){ //
        return(
             <ul>
                <li>
                    {this.props.city}
                </li>
                <li>
                    {this.props.country}
                </li>
                <li>
                    {this.props.temperature} 
                </li>
                <li>
                    {this.props.description}
                </li>
             </ul>
        )
    }
}
export default Weather;