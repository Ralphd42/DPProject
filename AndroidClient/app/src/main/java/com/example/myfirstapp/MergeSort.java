package com.example.myfirstapp;

import java.util.Arrays;

public class MergeSort {

    private int [] output;

    public void Sort( int ArrToSort[] , int startIndex, int endIndex)
    {
        if (startIndex < endIndex)
        {
            // Same as (l+r)/2, but avoids overflow for
            // large l and h
            int midIndx = startIndex+(endIndex-startIndex)/2;

            // Sort first and second halves
            Sort(ArrToSort, startIndex, midIndx);
            Sort(ArrToSort, midIndx+1, endIndex);

            merge(ArrToSort, startIndex, midIndx, endIndex);
        }








    }

    public String Sort( String toMerge)
    {
        String retval ="";
        String [] arr= toMerge.split(",");
        output = new int[arr.length];
        for( int i=0; i<arr.length;++i)
        {
            output[i] = Integer.parseInt(arr[i]);
        }
        Sort( output,0, arr.length-1);

        retval = Arrays.toString(output);


        return retval;
    }


    public void merge( int ArrToSort[] ,int startIndex , int middleIndex, int endIndex      )
    {

        int i, j, k;
        int n1 = middleIndex - startIndex + 1;
        int n2 =  endIndex - middleIndex;

        /* create temp arrays */
        int L[] = new int[n1];
        int R[] = new int[n2];

        /* Copy data to temp arrays L[] and R[] */
        for (i = 0; i < n1; i++)
            L[i] = ArrToSort[startIndex+ i];
        for (j = 0; j < n2; j++)
            R[j] = ArrToSort[middleIndex + 1+ j];

        /* Merge the temp arrays back into arr[l..r]*/
        i = 0; // Initial index of first subarray
        j = 0; // Initial index of second subarray
        k = startIndex; // Initial index of merged subarray
        while (i < n1 && j < n2)
        {
            if (L[i] <= R[j])
            {
                ArrToSort[k] = L[i];
                i++;
            }
            else
            {
                ArrToSort[k] = R[j];
                j++;
            }
            k++;
        }

    /* Copy the remaining elements of L[], if there
       are any */
        while (i < n1)
        {
            ArrToSort[k] = L[i];
            i++;
            k++;
        }

    /* Copy the remaining elements of R[], if there
       are any */
        while (j < n2)
        {
            ArrToSort[k] = R[j];
            j++;
            k++;
        }
    }
}
