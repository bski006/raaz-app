'use strict'

import React,
{
  Navigator,
  Component,
  Text
} from 'react-native'

import RNRF, {
  Route,
  Schema,
  TabBar
} from 'react-native-router-flux'

import { connect } from 'react-redux'
import Saved from './Saved'
import Posts from './Posts'
import NewPost from './Posts/NewPost'
import Login from './Login'
import Tuning from './tuning'

import MakesList from './components/MakesList'
import ModelsList from './components/ModelsList'
import SubmodelsList from './components/SubmodelsList'
import SpecsList from './components/SpecsList'

import PickMakes from './Posts/PickMakes'
import PickModels from './Posts/PickModels'
import PickSubmodels from './Posts/PickSubmodels'
import PickSpecs from './Posts/PickSpecs'
import TagTuning from './search/TagTuning'


import Notifications from './Notifications'
import TuningBySpec from './TuningBySpec'
import PartFilter from './filters/PartFilter'
import QRScreen from './components/QRScreen'

import CommentsList from './Comments/CommentsList'

import {BuildDetails, BuildsByPartId, BuildsByTag, BuildsBySpecId, BuildsByUserId} from './build'
import {PartDetails, Parts, PartByManufacturer} from './part'
import {MyBuilds, MyPosts, Settings} from './social'


class TabIcon extends Component {
  render() {
  return (
      <Text style={{color: this.props.selected ? 'black' :'gray'}}>{this.props.title}</Text>
    );
  }
}

class Raaz extends Component {

  render () {
      const Router = connect() (RNRF.Router)
      return (
          <Router hideNavBar={true}>
            <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
      	    <Schema name="floatFromRight" type="jump" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
            <Schema name="default" hideNavBar={false}/>
            <Schema name="tab" type="jump" icon={TabIcon} hideNavBar={true}/>
            <Route name="Login" component={Login} title="Login" hideNavBar={true} schema="default"/>
            <Route name="tabBar" hideNavBar={true}>
              <Router footer={TabBar} showNavigationBar={false}>
                <Route name="Tuning"
                  key="tuning"
                  component={Tuning}
                  title="TUNING"
                  schema="tab"
                  initial={true}
                  hideNavBar={true}
                  iconName={"Cars"}/>
                <Route name="Posts"
                  component={Posts}
                  key="posts"
                  title="SQUAD"
                  schema="tab"
                  hideNavBar={true}
                  iconName={"Posts"}/>
                <Route name="Notifications"
                  key="notifications"
                  component={Notifications}
                  title="MESSAGE"
                  schema="tab"
                  hideNavBar={true}
                  iconName={"Notifications"}/>
              </Router>
            </Route>


            <Route name="Makes" component={MakesList} title="Choose Makes" schema="floatFromRight" hideNavBar={true}/>
            <Route name="Models" component={ModelsList} title="Choose Models" schema="floatFromRight" hideNavBar={true}/>
            <Route name="Submodels" component={SubmodelsList} title="Choose Trims" schema="floatFromRight" hideNavBar={true}/>
            <Route name="Specs" component={SpecsList} title="Choose Specs" schema="floatFromRight" hideNavBar={true}/>

            <Route name="PickMakes" component={PickMakes} title="Choose Makes" schema="floatFromRight" hideNavBar={true}/>
            <Route name="PickModels" component={PickModels} title="Choose Models" schema="floatFromRight" hideNavBar={true}/>
            <Route name="PickSubmodels" component={PickSubmodels} title="Choose Trims" schema="floatFromRight" hideNavBar={true}/>
            <Route name="PickSpecs" component={PickSpecs} title="Choose Specs" schema="floatFromRight" hideNavBar={true}/>
            <Route name="TagTuning" component={TagTuning} title="Tag Parts" schema="floatFromRight" hideNavBar={true}/>


            <Route name="TuningBySpec" component={TuningBySpec} schema="default" hideNavBar={true}/>
            <Route name="NewPost" component={NewPost} schema="default" hideNavBar={true}/>

            <Route name="PartFilter" component={PartFilter} schema="default" hideNavBar={true}/>
            <Route name="WatchList" component={Saved} schema="default" hideNavBar={true}/>

            <Route name="PartDetails" component={PartDetails} schema="default" hideNavBar={true}/>
            <Route name="PartsList" component={Parts} schema="default" hideNavBar={true}/>
            <Route name="PartByManufacturer" component={PartByManufacturer} schema="default" hideNavBar={true}/>


            <Route name="BuildDetails" component={BuildDetails} schema="default" hideNavBar={true}/>
            <Route name="BuildsByPartId" component={BuildsByPartId} schema="default" hideNavBar={true}/>
            <Route name="BuildsBySpecId" component={BuildsBySpecId} schema="default" hideNavBar={true}/>
           
            <Route name="MyBuilds" component={MyBuilds} key="mybuilds" schema="default" hideNavBar={true} />
            <Route name="MyPosts" component={MyPosts} key="myposts" schema="default" hideNavBar={true} />
            <Route name="Settings" component={Settings} key="settings" schema="default" hideNavBar={true}/>
            <Route name="Comments" component={CommentsList} title="Comments" schema="default" hideNavBar={true}/>

            <Route name="QRScan" component={QRScreen} schema="default" hideNavBar={true}/>
          </Router>
      )
  }
}

export default connect () (Raaz)
