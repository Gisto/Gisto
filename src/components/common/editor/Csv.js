import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Papa from 'papaparse';

const TableWrapper = styled.div`
  overflow: auto;
  ${(props) => (props.height ? `height: ${props.height}px` : 'auto')};
`;

const Table = styled.table`
  margin: 0;
  padding: 0;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 100%;
  tr:nth-child(even) {
    background-color: ${(props) => props.theme.bg};
  }

  tr:hover {
    background-color: ${(props) => props.theme.headerBgLightest};
  }
`;
const Row = styled.tr`
  :first-of-type {
    font-weight: bold;
  }
`;

const IndexCell = css`
  margin: 0;
  padding: 10px;
  background: #fff;
  text-align: center;
  box-shadow: 0 7px 5px #ccc;
  width: 32px;
  display: block;
  position: relative;

  tr:hover & {
    font-weight: bold;
  }
`;

const Cell = styled.td`
  margin: 0;
  padding: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  ${(props) => (props.isIndex ? `${IndexCell}` : '')};
  max-width: 300px;
`;

const Csv = ({ text, className, height }) => {
  const csvData = Papa.parse(text);

  return (
    <TableWrapper className={ `csv-body ${className}` } height={ height }>
      <Table>
        <tbody>
          {csvData.data &&
            csvData.data.map((row, rowIndex) => (
              <Row key={ `row-${rowIndex + 1}` }>
                <Cell isIndex key={ `row-cell-${rowIndex + 1}` }>
                  {rowIndex + 1}
                </Cell>
                {row &&
                  row.map((cell, cellIndex) => (
                    <Cell title={ cell } key={ `cell-${cellIndex + 1}-${cell}` }>
                      {cell}
                    </Cell>
                  ))}
              </Row>
            ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

Csv.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number
};

export default Csv;
