import styles from './TodoViewForm.module.css';
import styled from "styled-components";

import { useState, useEffect } from 'react';

function TodoViewForm({sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString}) {
    
    const [localQueryString, setLocalQueryString] = useState(queryString);  
    
    useEffect(() => {
    const debounce = setTimeout(() => {
        setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
    }, [localQueryString, setQueryString]);
    

    function preventRefresh(event){
        event.preventDefault();
    }
  
    return(
    <form onSubmit={preventRefresh}>
    <div>
    <label>
        Search Todos:
        <input
        type="text"
        value={localQueryString}
        onChange={(e) => setLocalQueryString(e.target.value)}
        />
    </label>
    <button
        type="button"
        onClick={() => setLocalQueryString("")}
    >
        Clear
    </button>
    </div>
        <div>
            <label htmlFor="sortField"> Sort by </label>
            <select id="sortField" 
            name="sortField" 
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            >
                <option value="title">Title</option>
                <option value="createdTime">Time added</option>
            </select>            
            <label htmlFor="sortDirection"> Direction </label>
            <select id="sortDirection" 
            name="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    </form>
  )
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledFieldset = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
`;

const StyledLabel = styled.label`
  font-weight: 600;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
`;

const StyledButton = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

export default TodoViewForm;