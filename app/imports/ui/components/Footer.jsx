/* Code written by Sophia Kim */

import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {NavLink} from "react-router-dom";


/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    return (
        <div className='footer-background'>
            <Menu attached='bottom' secondary >
                <Menu.Item href='mailto:therunningfrogs.biz@gmail.com'>
                    Contact Us
                </Menu.Item>
                <Menu.Item href='//github.com/The-Running-Frogs/calendarG' target='_blank'>
                    GitHub Repo
                </Menu.Item>
                <Menu.Item as={NavLink} activeClassName="" exact to="/help">
                    Help
                </Menu.Item>
                <Menu.Item href='//hawaii.edu' target='_blank'>
                    University of Hawaiʻi
                </Menu.Item>
                <Menu.Item position='right'>
                    <Icon name='copyright outline'/> 2020 The Running Frogs
                </Menu.Item>
            </Menu>
        </div>
    );
  }
}

export default Footer;
