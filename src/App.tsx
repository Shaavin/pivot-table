import PivotTable from "./PivotTable";
import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;
  white-space: nowrap;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

export default function App() {
  return (
    <div>
      <h1>Notes on Usage</h1>
      <p>
        Click on a column header button (👊) to aggregate data by the column.
        Click on additional column header buttons to continue aggregating data
        within each category, or click on them again (🛑) to stop aggregating by
        that field.
      </p>
      <p>
        For instance, clicking on "Item" will group and display results by item
        type. Then, clicking on "Region" will sub-group data by region for each
        item. Further yet clicking "Employee" will show aggregated results for
        each item, per region, and then for each employee.
      </p>
      <p>
        For each aggregated group, you can click to expand the group to see the
        subgroups that it's comprised of.
      </p>
      <p>
        You can also click on the text of a column header to sort the table by
        that value. For instance, clicking on the "Region" will alphabetize the
        results by region name.
      </p>
      <h1>Sales Results Table</h1>
      <Styles>
        <PivotTable />
      </Styles>
    </div>
  );
}
