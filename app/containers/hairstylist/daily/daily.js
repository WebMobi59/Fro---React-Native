import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform} from "react-native";
import Button from 'react-native-button';
import { Actions as NavigationActions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import { setDailyBadge } from '../../../actions';

import PercentageCircle from 'react-native-percentage-circle';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var times, days
var daily_badge = 0

class Daily extends React.Component {
    constructor(props) {
        super(props);

        var date = new Date();
        var day = dayNames[date.getDay()];
        var month = monthNames[date.getMonth()];
        var dates = date.getDate();
        var year = date.getFullYear();

        this.state = {
          date: day + ', ' + month + ' ' + dates + ', ' + year,
          alerts: [
            {
              icon: require('../../../img/david.jpg'),
              name: 'Brandon Crownley',
              available: new Date(2017, 2, 7, 11, 0),
              type: "Women's Cut",
              ability: '30 mins',
              reading: false
            },
            {
              icon: require('../../../img/stylist.png'),
              name: 'David Cameron',
              available: new Date(2017, 2, 8, 10, 30),
              type: "Women's Cut",
              ability: '30 mins',
              reading: false
            }
          ],
          appointments: [
            {
              icon: require('../../../img/david1.jpeg'),
              name: 'Brandon Crownley',
              star: 4.5,
              available: new Date(2017, 2, 30, 11, 0),
              type: "Women's Cut",
              ability: '30 mins',
              reading: false
            }
          ],
        }
    }

    componentDidMount() {

    }

    getDates(date){
      var day = dayNames[date.getDay()];
      var month = monthNames[date.getMonth()];
      var dates = date.getDate();
      var year = date.getFullYear();

      var hours = date.getHours()
      hours = (hours+24)%24
      var mid='AM'
      if(hours==0){
        hours=12
      }else if(hours>12){
        hours=hours%12
        mid='PM'
      }
      if(date.getMinutes() < 10)var minutes = '0' + date.getMinutes()
      else var minutes = date.getMinutes()

      times = hours + ':' + minutes + ' ' + mid

      days = day + ', ' + month + ' ' + dates

      return times
    }

    appointmentPress(appointment, i){
      var change_appointments = this.state.appointments
      change_appointments[i].reading = true
      this.setState({appointments:change_appointments})

      daily_badge = 0
      this.state.appointments.map((appointment, i) => {
        if(!appointment.reading)daily_badge++
      })

      if(this.state.alerts != null){
        this.state.alerts.map((alert, i) => {
          if(!alert.reading)daily_badge++
        })
      }

      this.props.setDailyBadge(daily_badge)

      NavigationActions.pending()
    }

    alertPress(alert, i){
      var change_alerts = this.state.alerts
      change_alerts[i].reading = true
      this.setState({alerts:change_alerts})

      daily_badge = 0
      this.state.alerts.map((alert, i) => {
        if(!alert.reading)daily_badge++
      })

      if(this.state.appointments != null){
        this.state.appointments.map((appointment, i) => {
          if(!appointment.reading)daily_badge++
        })
      }

      this.props.setDailyBadge(daily_badge)
    }

    render() {
        return (
          <View style={styles.container}>
            <View style={styles.navBar}>
              <Text style={{fontSize: 14, fontFamily: 'Montserrat', color: 'white', textAlign: 'center', marginTop: Platform.OS === 'ios' ? 15 : 0}}>{this.state.date}</Text>
              <TouchableOpacity  style={{alignSelf: 'center', position: 'absolute', right: 12, top: Platform.OS === 'ios' ? 23 : 5}} onPress={this.props.press}>
                <Text style={{fontSize: 20, fontFamily: 'Montserrat', color: 'white', textAlign: 'center'}}>+</Text>
              </TouchableOpacity>
            </View>

            {
              this.props.service_state != 0 || this.props.photo_state != 0 || this.props.address_state != 0 || this.props.about_state != 0 ? (
                <View style={styles.top_view}>
                  <Text style={{fontSize: 20, fontFamily: 'Montserrat', textAlign: 'center', marginBottom: 10}}>No Reservation Requests</Text>
                  <Text style={{fontSize: 14, fontFamily: 'Montserrat', textAlign: 'center'}}>You have no reservation requests right now.{'\n'}Make sure to share your profile with all your{'\n'}clients and friends.</Text>
                </View>
              ) : this.state.appointments == null ? (
                <View style={styles.top_view}>
                  <Text style={{fontSize: 20, fontFamily: 'Montserrat', textAlign: 'center', marginBottom: 10}}>No Appointments Today</Text>
                </View>
              ) : (
                <View style={styles.top_view}>
                  <ScrollView>
                    {
                      this.state.appointments.map((appointment, i) => <TouchableOpacity key={i} style={styles.appointment_touch} onPress={() => this.appointmentPress(appointment, i)}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column', marginLeft: 25}}>
                            <Text style={{fontSize: 16, fontFamily: 'Montserrat', textAlign: 'left',}}>{appointment.name}</Text>
                            {
                              this.getDates(appointment.available),
                              <Text style={[styles.info_text, {color: '#f26c4f'}]}>{times + ' ・ ' + appointment.ability}</Text>
                            }
                            <Text style={[styles.info_text, {color: '#f26c4f'}]}>{appointment.type}</Text>
                          </View>
                          <Image source={appointment.icon} style={styles.profile}/>
                        </View>
                      </TouchableOpacity>)
                    }
                  </ScrollView>
                </View>
              )
            }


            <View style={{width: width, height: 60, borderBottomWidth: 0.2, justifyContent: 'center'}}>
              <Text style={{fontSize: 20, fontFamily: 'Montserrat', textAlign: 'left', marginLeft: 25}}>Alerts</Text>
            </View>

            {
              this.props.service_state != 0 || this.props.photo_state != 0 || this.props.address_state != 0 || this.props.about_state != 0 ? (
                <View style={styles.bottom_view}>
                  <View style={{alignSelf: 'center', marginBottom: 30}}>
                    <PercentageCircle radius={50} percent={25*(this.props.service_state+this.props.photo_state+this.props.address_state+this.props.about_state)} color={"#9bd01a"} borderWidth={5} textStyle={{fontSize:20, color:'#9bd01a'}}></PercentageCircle>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column'}}>
                      <View style={styles.check_view}>
                        <Image source={this.props.service_state == 0 ? require('../../../img/check_gray.png') : require('../../../img/check.png')}  style={{width: 20,height: 20}}/>
                        <Text style={this.props.service_state == 0 ? [styles.check_text, {color: '#d7d7d7'}] : styles.check_text}>Services</Text>
                      </View>
                      <View style={styles.check_view}>
                        <Image source={this.props.address_state == 0 ? require('../../../img/check_gray.png') : require('../../../img/check.png')}  style={{width: 20,height: 20}}/>
                        <Text style={this.props.address_state == 0 ? [styles.check_text, {color: '#d7d7d7'}] : styles.check_text}>Location</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'column', marginLeft: 40}}>
                      <View style={styles.check_view}>
                        <Image source={this.props.photo_state == 0 ? require('../../../img/check_gray.png') : require('../../../img/check.png')}  style={{width: 20,height: 20}}/>
                        <Text style={this.props.photo_state == 0 ? [styles.check_text, {color: '#d7d7d7'}] : styles.check_text}>Photos</Text>
                      </View>
                      <View style={styles.check_view}>
                        <Image source={this.props.about_state == 0 ? require('../../../img/check_gray.png') : require('../../../img/check.png')}  style={{width: 20,height: 20}}/>
                        <Text style={this.props.about_state == 0 ? [styles.check_text, {color: '#d7d7d7'}] : styles.check_text}>About Me</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity  style={{alignSelf: 'center', marginTop: 20}} onPress={NavigationActions.profileComplete}>
                    <Text style={{fontSize: 14, fontFamily: 'Montserrat', color: '#f26c4f', textAlign: 'center'}}>Complete your profile</Text>
                  </TouchableOpacity>
                </View>
              ) : this.state.alerts == null ? (
                <View style={styles.bottom_view}>
                  <Text style={{fontSize: 20, fontFamily: 'Montserrat', textAlign: 'center', marginBottom: 10}}>No Alerts Today</Text>
                </View>
              ) : (
                <View style={[styles.bottom_view, {marginTop: 0}]}>
                  <ScrollView>
                    {
                      this.state.alerts.map((alert, i) => <TouchableOpacity style={styles.alert_touch} key={i} onPress={() => this.alertPress(alert, i)}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            <Text style={{fontSize: 16, fontFamily: 'Montserrat', textAlign: 'left',}}>{alert.name}</Text>
                            {
                              this.getDates(alert.available),
                              <Text style={[styles.info_text, {color: '#363636'}]}>{days + ' ・ ' + times}</Text>
                            }
                            <Text style={[styles.info_text, {color: '#363636'}]}>{alert.type + ' ・ ' + alert.ability}</Text>
                          </View>
                          <Image source={alert.icon} style={[styles.profile, {position: 'absolute', right: 0}]}/>
                        </View>
                      </TouchableOpacity>)
                    }
                  </ScrollView>
                </View>
              )
            }

          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection:'row',
    height: Platform.OS === 'ios' ? 60 : 40,
    width: width,
    backgroundColor: "#63b7b7",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {height: 1,width: 0},
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  top_view: {
    flexDirection: 'column',
    width: width,
    height: 140,
    alignSelf: 'center',
    borderBottomWidth: 0.2,
    justifyContent: 'center'
  },
  bottom_view: {
    flexDirection: 'column',
    width: width,
    height: height-310,
    marginTop: 25,
    alignSelf: 'center',
    alignItems: 'center',
  },
  check_view: {
    flexDirection: 'row',
    height: 30,
  },
  check_text: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'Montserrat',
    marginLeft: 7
  },
  info_text: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    textAlign: 'left'
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    right: 25
  },
  appointment_touch: {
    width: width,
    height: 140,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  alert_touch: {
    width: width - 50,
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

const mapStateToProps = (state) => {
    const props = {
      daily_badge: state.daily.daily_badge,
      photo_state: state.daily.photo_state,
      service_state: state.daily.service_state,
      address_state: state.daily.address_state,
      about_state: state.daily.about_state,
    };
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
      setDailyBadge: (daily_badge) => {
          dispatch(setDailyBadge(daily_badge));
      }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Daily)
