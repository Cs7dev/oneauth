import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OakAutoComplete from '../../oakui/OakAutoComplete';
import { updateRoles, fetchRoles } from '../../actions/OaRoleActions';
import OakButton from '../../oakui/OakButton';
import Member from './Member';

interface Props {
  app: any;
  toggleVisibilityHandler: Function;
}

const EditAdministrators = (props: Props) => {
  const dispatch = useDispatch();
  const authorization = useSelector(state => state.authorization);
  const oaUsers = useSelector(state => state.oaUsers);
  const oaRoles = useSelector(state => state.oaRoles);
  const [items, setItems] = useState<undefined | any[]>([{}]);
  const [data, setData] = useState({
    autoCompleteDropdownData: [{}],
  });

  useEffect(() => {
    dispatch(fetchRoles(authorization));
  }, [authorization]);

  useEffect(() => {
    const oaRole = oaRoles.data.data?.filter(
      item => item.domainId === props.app._id
    );
    const oaUser = diff(oaRole, oaUsers.data);
    setItems(oaUser);
  }, [oaRoles.data.data]);

  const diff = (arr, arr2) => {
    const ret: any[] = [];
    arr2.map(item1 => {
      arr.map(item => {
        if (item1._id.indexOf(item.userId) > -1) {
          ret.push(item1);
        }
      });
    });
    return ret;
  };

  useEffect(() => {
    let list: any[] = [];
    oaUsers.data?.map(item => {
      list.push({ key: item._id, value: item.email });
    });

    const adminList: any[] = [];
    if (items) {
      items.map(item => adminList.push({ id: item._id }));
    }
    list = list.filter(val => {
      return !adminList.some(item => {
        return val.key === item.id;
      });
    });
    setData({ autoCompleteDropdownData: list });
  }, [oaUsers.data, items]);

  const handleAutoCompleteChange = (value: string) => {
    dispatch(
      updateRoles(authorization, {
        type: 'app',
        userId: value,
        domainId: props.app._id,
      })
    );
  };

  return (
    <>
      <div className="modal-body">
        <div className="autocomplete-users space-bottom-2">
          <OakAutoComplete
            placeholder="Search by user name"
            handleChange={handleAutoCompleteChange}
            objects={data.autoCompleteDropdownData}
          />
        </div>
        <div
          className="oaapp-view space-top-2 space-bottom-4"
          key={oaUsers._id}
        >
          <div className="list-view-header typography-5">
            <div className="label">Email</div>
            <div className="label">Name</div>
            <div className="label" />
          </div>
          {items?.map(item => (
            <Member
              member={item}
              domainId={props.app._id}
              domainType="app"
              key={item._id}
              owner={props.app.createdBy}
            />
          ))}
        </div>
      </div>
      <div className="modal-footer">
        <OakButton
          action={props.toggleVisibilityHandler}
          theme="default"
          variant="appear"
          align="left"
        >
          <i className="material-icons">close</i>Close
        </OakButton>
      </div>
    </>
  );
};

export default EditAdministrators;
