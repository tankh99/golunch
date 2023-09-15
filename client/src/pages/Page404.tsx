import * as React from 'react';
import {Image} from 'semantic-ui-react';

export interface IAppProps {
}

export interface IAppState {
}

export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
    }
  }
  
  componentDidMount(){
    console.log("Looks like you found your way here")
  }

  render() {
    return (
      <div>
        <Image src={require("../images/page404.png")} />
      </div>
    );
  }
}
