/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-curly-newline */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ChooseRealm.scss';
import { mapGridcontrolByClient } from './ClientService';
import { Button, ThemeType, Checkbox } from 'basicui';

interface Props {
  data: any[];
  realms: any[];
  clientId: string;
  handleClose: any;
  handleUpdate: any;
}

const ChooseRealm = (props: Props) => {
  const dispatch = useDispatch();
  const authorization = useSelector((state: any) => state.authorization);
  const [choosenRecords, setChoosenRecords] = useState<number[]>([]);

  const handleSelection = (event: any) => {
    if (event.currentTarget.value) {
      setChoosenRecords([...choosenRecords, event.currentTarget.name]);
    } else {
      setChoosenRecords(choosenRecords.filter((item) => item !== event.currentTarget.name));
    }
  };

  const handleSave = () => {
    mapGridcontrolByClient(props.clientId, choosenRecords).then(() => {
      props.handleUpdate();
    });
  };

  return (
    <div className="choose-realm">
      <div className="choose-realm__header">
        <div className="control-grid__action">
          {choosenRecords.length > 0 && (
            <>
              <Button
                onClick={handleSave}
                theme={ThemeType.primary}
              >
                Link choosen realms
              </Button>
              <Button
                onClick={() => setChoosenRecords([])}
              >
                Clear
              </Button>
            </>
          )}
          <Button
            onClick={props.handleClose}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="choose-realm__main">
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>Realm name</th>
              <th>Realm description</th>
            </tr>
          </thead>
          <tbody>
            {props.realms?.map((item) => (
              <tr
                key={item._id}
                className={
                  choosenRecords.includes(item.realm)
                    ? 'choose-realm__main__record choose-realm__main__record--active'
                    : 'choose-realm__main__record'
                }
              >
                <td>
                  <div className="context-action">
                    <Checkbox
                    id={item.realm}
                      value={choosenRecords.includes(item.realm)}
                      name={item.realm}
                      onInput={handleSelection}
                    />
                  </div>
                </td>
                <td
                  onClick={() =>
                    handleSelection({
                      name: item.realm,
                      value: !choosenRecords.includes(item.realm),
                    })
                  }
                >
                  {item.name}
                </td>
                <td
                  onClick={() =>
                    handleSelection({
                      name: item.realm,
                      value: !choosenRecords.includes(item.realm),
                    })
                  }
                >
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChooseRealm;
