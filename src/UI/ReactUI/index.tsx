// import React from 'react'
// import { ISlicedConfig } from '../..'

// export type ISlicedProps = {
//   readonly initialValue?: string
//   readonly initialConfig?: ISlicedConfig
//   multiline?: boolean
// }

// export type ISlicedState = {
//   context: ISlicedConfig
// }

// class SlicedTextView extends React.Component<ISlicedProps, ISlicedState> {
//   pointer: number; // like this

//   componentDidMount() {
//     this.pointer = 3;
//   }

//   render() {
//     return (
//       <div>
//         {this.props.message} and {this.pointer}
//       </div>
//     );
//   }
// }


/* function withSubscription(WrappedComponent, selectData) {
    // ...and returns another component...
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
          data: selectData(DataSource, props)
        };
      }
  
      componentDidMount() {
        // ... that takes care of the subscription...
        DataSource.addChangeListener(this.handleChange);
      }
  
      componentWillUnmount() {
        DataSource.removeChangeListener(this.handleChange);
      }
  
      handleChange() {
        this.setState({
          data: selectData(DataSource, this.props)
        });
      }
  
      render() {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return <WrappedComponent data={this.state.data} {...this.props} />;
      }
    };
  } */


