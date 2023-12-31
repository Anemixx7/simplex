import logo from './logo.svg';
import logoU from './R.png';
import './App.scss';
import { createRef, useEffect, useRef, useState } from 'react';

const CtmInput = (props) => {
  return (
    <div className='ctminput'>
      <label>{props.restri ? "R" + props.number : "X" + props.number}</label>
      <input
        value={props.value}
        onChange={props.onChange}
      ></input>
    </div>
  )
}

const Rest = (props) => {
  return (
    <div className='Rest'>
      <p className='titleRestri'>{props.value}</p>
      <div style={{ display: 'flex', marginBottom: '1vw', flexWrap: 'wrap', justifyContent: 'center' }}>
        {props.values.map((d, i) => {
          return (
            d.desc !== "" && <div className='divTarget' key={i} style={{ width: i + 2 >= props.values.length ? '37%' : '20%' }}>
              <CtmInput
                key={i}
                value={d.value}
                number={i}
                onChange={e => props.onChange(i, e.target.value)}
              />
              {i + 2 < props.values.length && <label>+</label>}
              {i + 2 >= props.values.length && <label>{props.isTar ? "=> MAX" : ">="}</label>}
              {i + 2 >= props.values.length && !props.isTar &&
                <input
                  style={{ width: '3vw' }}
                  value={props.value1}
                  onChange={e => props.onChange1(i, e.target.value)}></input>
              }
            </div>
          )
        })}
      </div>
    </div >
  )
}

function App() {
  const [vars, setVars] = useState([{ "desc": "" }])
  const [restri, setRestri] = useState([{ "desc": "" }])
  const [hasDeleted, setHasDeleted] = useState(false);
  const [hasDeletedRestri, setHasDeletedRestri] = useState(false);
  const [restriVars, setRestriVars] = useState([]);
  const [tar, setTar] = useState({});
  const [result, setResult] = useState(false);

  useEffect(() => {
    setRestriVars(
      restri.map(r => ({
        ...r,
        vars: vars.map(v => ({ ...v, value: "" }))
      }))
    );
  }, [restri, vars]);

  useEffect(() => {
    setTar(
      vars.map(r => ({
        desc: r.desc,
        value: ""
      }))
    );
  }, [vars]);

  useEffect(() => {
    if (vars.every(v => v.desc !== "")) {
      setVars(prevVars => [...prevVars, { desc: "" }]);
      setHasDeleted(false);
    } else if (!hasDeleted && vars.length > 1 && vars.slice(0, -1).some(v => v.desc === "")) {
      setVars(prevVars => prevVars.slice(0, -1));
      setHasDeleted(true);
    }
  }, [vars, hasDeleted]);

  useEffect(() => {
    if (restri.every(v => v.desc !== "")) {
      setRestri(prevVars => [...prevVars, { desc: "" }]);
      setHasDeletedRestri(false);
    } else if (!hasDeletedRestri && restri.length > 1 && restri.slice(0, -1).some(v => v.desc === "")) {
      setRestri(prevVars => prevVars.slice(0, -1));
      setHasDeletedRestri(true);
    }
  }, [restri, hasDeleted]);

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='container'>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '-2vw' }}>
            <p style={{ width: '10vw', fontSize: '1vw', color: '#212529' }}>
              Desarrollado por los estudiantes:
              <p>OSCAR MAURICIO MOJICA ZAMBRANO</p>
              <p>LEONEL OSWALDO TORRES</p>
            </p>
            <img src={logoU} style={{ width: '10vw', height: '8vw' }} />
          </div>
          <p className='title'>Configuramos el modelo</p>
          <div className='card'>
            <p className='pCard title'>Variables</p>
            <div className='inputs'>
              {vars.map((d, i) => {
                return (
                  <CtmInput
                    key={i}
                    value={d.desc}
                    number={i}
                    onChange={e => {
                      const newVars = [...vars];
                      newVars[i].desc = e.target.value;
                      setVars(newVars);
                    }}
                  />)
              })}
            </div>
          </div>
          <div className='card title'>
            <p className='pCard'>Restricciones</p>
            <div className='inputs'>
              {restri.map((d, i) => {
                return (
                  <CtmInput
                    key={i}
                    value={d.desc}
                    number={i}
                    restri
                    onChange={e => {
                      const newRestri = [...restri];
                      newRestri[i].desc = e.target.value;
                      setRestri(newRestri);
                    }}
                  />)
              })}
            </div>
          </div>
          <div className='card title'>
            <p className='pCard'>Función objetivo</p>
            <div className='inputs'>
              <Rest
                values={vars}
                isTar
                onChange={(j, newValue) => {
                  setTar(prevTar => {
                    const newTar = [...prevTar];
                    newTar[j].value = newValue;
                    return newTar;
                  });
                }}
              />
            </div>
          </div>
          <div className='card title'>
            <p className='pCard'>Restricciones</p>
            <div className='inputs'>
              {restri.map((d, i) => {
                return (
                  d.desc !== "" && <Rest
                    key={i}
                    value={d.desc}
                    number={i}
                    values={vars}
                    onChange={(j, newValue) => {
                      setRestriVars(prevRestriVars => {
                        const newRestriVars = [...prevRestriVars];
                        newRestriVars[i].vars[j].value = newValue;
                        return newRestriVars;
                      });
                    }}
                    value1={restriVars[i].vars[vars.length - 1].value}
                    onChange1={(j, newValue) => {
                      setRestriVars(prevRestriVars => {
                        const newRestriVars = [...prevRestriVars];
                        newRestriVars[i].vars[vars.length - 1].value = newValue;
                        return newRestriVars;
                      });
                    }}
                  />
                )
              })}
            </div>
          </div>
          <button
            style={{ width: '10vw', height: '3vw', fontSize: '1vw', marginBottom: '2vw' }}
            onClick={() => {
              const constraints = {};
              for (const constraint of restriVars) {
                if (constraint.desc) {
                  const key = constraint.desc;
                  for (const variable of constraint.vars) {
                    if (!variable.desc) {
                      const value = Number(variable.value);
                      constraints[key] = { max: value };
                    }
                  }
                }
              }
              const variables = {};
              for (const variable of tar) {
                if (variable.desc) {
                  const key = variable.desc;
                  const value = Number(variable.value);
                  variables[key] = { profit: value };
                }
              }
              for (const constraint of restriVars) {
                if (constraint.desc) {
                  const constraintKey = constraint.desc;
                  for (const variable of constraint.vars) {
                    if (variable.desc) {
                      const variableKey = variable.desc;
                      const value = Number(variable.value);
                      if (!variables[variableKey]) {
                        variables[variableKey] = {};
                      }
                      variables[variableKey][constraintKey] = value;
                    }
                  }
                }
              }
              const ints = {};
              for (const value of vars) {
                if (value.desc) {
                  const key = value.desc;
                  ints[key] = 1;
                }
              }
              const model = {
                "optimize": "profit",
                "opType": "max",
                "constraints": constraints,
                "variables": variables,
                "ints": ints
              }
              fetch('http://localhost:3001/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(model)
              })
                .then(response => response.json())
                .then(result => {
                  setResult(result);
                });
            }}>
            Calcular
          </button>
          {result ? <div className='card title'>
            <p className='pCard'>Solucion</p>
            <ul>
              <li>Factible: {result.feasible.toString()}</li>
              <li>Resultado: {result.result}</li>
              <li>Acotado: {result.bounded.toString()}</li>
              <li>Integral: {result.isIntegral.toString()}</li>
              {vars.map(field => {
                if (field.desc && result.hasOwnProperty(field.desc)) {
                  return <li key={field.desc}>{field.desc.charAt(0).toUpperCase() + field.desc.slice(1)}: {result[field.desc]}</li>;
                }
                return null;
              })}
            </ul>
          </div>
            :
            result && result.feasible === false &&
            <div className='card title'>
              <p className='pCard'>Sin solución factible</p>
            </div>}
        </div>
      </div>
    </div>
  );
}

export default App;
