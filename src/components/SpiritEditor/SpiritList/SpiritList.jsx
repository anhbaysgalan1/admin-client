import React, { Component } from 'react';
import './SpiritList.css';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import * as R from 'ramda';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {
  NavLink, Route, Redirect,
} from 'react-router-dom';
import Highlight from 'react-highlighter';

import { Search } from './Search';

import { SpiritListPropTypes } from '../../../types';

const sort = R.sortBy(R.pipe(R.prop('name'), R.toLower));

const spiritLink = (spirit) => `/spiritEditor/${spirit.id}#${spirit.name}`;

export class SpiritList extends Component {
  static propTypes = SpiritListPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      spirits: [],
      removedSpiritIndex: null,
      searchStr: '',
    };
    this.onPutSpirit = this.onPutSpirit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.handleSpiritSubmit = this.handleSpiritSubmit.bind(this);
  }

  componentDidMount = () => {
    // console.log('SpiritList mounted');
    // const spirits = this.props.spiritService.getSpirits();
    const spirits = this.props.spiritService.get('spirits');

    const spirits2 = sort(spirits || []);
    this.setState({
      spirits: spirits2,
    });
    this.props.spiritService.on('putSpirit', this.onPutSpirit);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.spiritService === this.props.spiritService) {
      return;
    }
    prevProps.spiritService.off('putSpirit', this.onPutSpirit);
    this.props.spiritService.on('putSpirit', this.onPutSpirit);
    // const spirits = this.props.spiritService.getSpirits();
    const spirits = this.props.spiritService.get('spirits');
    const spirits2 = sort(spirits || []);
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      spirits: spirits2,
      removedSpiritIndex: null,
      searchStr: '',
    });
    // console.log('SpiritList did update');
  }

  componentWillUnmount = () => {
    // console.log('SpiritList will unmount');
    this.props.spiritService.off('putSpirit', this.onPutSpirit);
  }

  // eslint-disable-next-line react/sort-comp
  onPutSpirit(changedSpirit) {
    const { spirits } = this.state;
    const newSpirits = spirits.map((spirit) => {
      if (changedSpirit.id !== spirit.id) {
        return spirit;
      }
      return changedSpirit;
    });

    this.setState({
      spirits: sort(newSpirits),
      removedSpiritIndex: null,
    });
  }

  onSearchChange(searchStr) {
    this.setState({
      searchStr,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  getSpiritList() {
    const { spirits, searchStr } = this.state;
    const { t } = this.props;
    const lowerSearchStr = searchStr.toLowerCase();
    // eslint-disable-next-line max-lines-per-function
    return spirits.filter((spirit) => spirit.name.toLowerCase().includes(lowerSearchStr) || spirit.fraction.toLowerCase().includes(lowerSearchStr))
      // eslint-disable-next-line max-lines-per-function
      .map((spirit) => (
        <li key={spirit.id} className="SpiritListItem relative">
          <NavLink
            to={spiritLink(spirit)}
            className="
                NavLink
                px-3
                py-2
                block
                text-gray-900
                hover:text-gray-900
                no-underline
                hover:no-underline
                focus:outline-none
                focus:shadow-outline
                hover:bg-indigo-200
                active:bg-indigo-600
              "
          >
            <div className="menu float-right">
              <Dropdown
                onToggle={(isOpen, e) => {
                  if (e.stopPropagation) e.stopPropagation();
                  if (e.preventDefault) e.preventDefault();
                }}
              >
                <Dropdown.Toggle className="
                    tw-btn
                    tw-btn-ghost
                    SpiritMenuButton
                    w-8
                    h-8
                    hover:bg-indigo-300
                    active:bg-indigo-600
                    focus:outline-none
                    focus:shadow-outline
                    active:bg-indigo-600
                    opacity-0
                    hover:opacity-100
                    focus:opacity-100
                    tw-dropdown-toggle
                    p-0
                  "
                >
                  <FontAwesomeIcon icon={faEllipsisH} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as="button"
                    onClick={(e) => this.cloneSpirit(e, spirit.id)}
                  >
                    {t('clone')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={(e) => this.removeSpirit(e, spirit.id)}
                  >
                    {t('delete')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="body">
              <div className="spirit-name font-bold text-sm">
                {
                  spirit.name ? (
                    <Highlight search={lowerSearchStr} matchClass="p-0 bg-yellow-400 text-color-inherit">
                      {spirit.name}
                    </Highlight>
                  ) : t('nameless')
                }
              </div>
              <div className="spirit-fraction text-sm">
                {spirit.fraction ? (
                  <Highlight search={lowerSearchStr} matchClass="p-0 bg-yellow-400 text-color-inherit">
                    {spirit.fraction}
                  </Highlight>
                ) : t('noFraction')}
              </div>
            </div>
          </NavLink>
        </li>
      ));
  }

  getCreateSpiritPopover(t) {
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">{t('enterSpiritName')}</Popover.Title>
        <Popover.Content>
          <Form onSubmit={this.handleSpiritSubmit}>
            <Form.Group controlId="spiritName">
              <Form.Control
                type="text"
                required
                ref={(el) => (this.newSpiritInput = el)}
              />
            </Form.Group>
            <div className="text-right">
              <Button variant="primary" type="submit">
                {t('createSpirit')}
              </Button>
            </div>
          </Form>
        </Popover.Content>
      </Popover>
    );
  }

  createNewSpirit(spiritName) {
    const { spiritService, history } = this.props;
    // const spirit = spiritService.postSpirit({ name: spiritName });
    const spirit = spiritService.execute({
      type: 'postSpirit',
      props: { name: spiritName },
    });
    history.push(spiritLink(spirit));
    this.setState((state) => {
      const spirits = sort([...state.spirits, spirit]);
      return {
        spirits,
        removedSpiritIndex: null,
      };
    });
  }

  cloneSpirit(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const { spiritService, history } = this.props;
    // const spirit = spiritService.cloneSpirit(id);
    const spirit = spiritService.execute({
      type: 'cloneSpirit',
      id,
    });
    history.push(spiritLink(spirit));
    this.setState((state) => {
      const spirits = sort([...state.spirits, spirit]);
      return {
        spirits,
        removedSpiritIndex: null,
      };
    });
  }

  removeSpirit(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const { spiritService } = this.props;
    // spiritService.deleteSpirit(id);
    spiritService.execute({
      type: 'deleteSpirit',
      id,
    });
    this.setState((state) => {
      const index = state.spirits.findIndex((spirit) => spirit.id === id);
      const spirits = state.spirits.filter((spirit) => spirit.id !== id);
      // history.push(spiritLink(spirits[index] || spirits[index - 1]));
      return {
        spirits,
        removedSpiritIndex: index,
      };
    });
  }

  handleSpiritSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      this.createNewSpirit(form.spiritName.value);
      form.spiritName.value = '';
    }
  }


  // eslint-disable-next-line max-lines-per-function
  render() {
    const { spirits, removedSpiritIndex } = this.state;
    const { t } = this.props;

    // if (newSpirit) {
    //   return <Redirect to={spiritLink(newSpirit)} />;
    // }

    return (
      <div className="SpiritList flex-grow-0 flex flex-col bg-gray-200">

        <div className="bg-gray-400 flex-grow-0 text-right px-3 py-2 flex">
          <Search
            className="flex-grow "
            placeholder={t('findSpirit')}
            onSearchChange={this.onSearchChange}
          />
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={this.getCreateSpiritPopover(t)}
            rootClose
            rootCloseEvent="click"
          >
            <button
              type="button"
              className="tw-btn tw-btn-blue whitespace-no-wrap flex-grow-0 newSpiritButton ml-4"
              onClick={() => {
                setTimeout(() => {
                  if (this.newSpiritInput) {
                    this.newSpiritInput.focus();
                  }
                }, 50);
              }}
            >
              <FontAwesomeIcon className="fill-current w-4 h-4 mr-2" icon={faPlus} />
              <span>
                {t('newSpirit')}
              </span>
            </button>
          </OverlayTrigger>
        </div>
        <Route
          path="/spiritEditor"
          render={() => (spirits.length === 0
            ? <div className="alert-block alert alert-info">{t('createSpirits')}</div>
            : <Redirect to={spiritLink(spirits[0])} />)}
          exact
        />
        <Route
          path="/spiritEditor/:id"
          render={({ match }) => {
            const { id } = match.params;
            if (!spirits.map(R.prop('id')).includes(Number(id))) {
              if (spirits.length === 0) {
                return <Redirect to="/spiritEditor" />;
              }
              if (removedSpiritIndex) {
                return <Redirect to={spiritLink(spirits[removedSpiritIndex] || spirits[removedSpiritIndex - 1])} />;
              }
              return <Redirect to={spiritLink(spirits[0])} />;
            }

            return null;
          }}
        />
        <div className=" flex-grow overflow-auto">
          <ul>
            {
              this.getSpiritList()
            }
          </ul>
        </div>
      </div>
    );
  }
}
