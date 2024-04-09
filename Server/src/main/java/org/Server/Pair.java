package org.Server;
public class Pair<T1, T2> {
    private T1 first; // First member of pair
    private T2 second; // Second member of pair

    public Pair(T1 first, T2 second) {
        this.first = first;
        this.second = second;
    }

    /*
        @Brief: This function is used to get the first element of the pair.
        @Return: T1 - Returns the first element in the pair.
     */
    public T1 getFirst() {
        return first;
    }

    /*
        @Brief: This function is used to set the first element of the pair.
        @Param: first - The first element.
        @Return: void - Returns nothing.
     */
    public void setFirst(T1 first) {
        this.first = first;
    }


    /*
        @Brief: This function is used to get the second element of the pair.
        @Return: T2 - Returns the second element in the pair.
     */
    public T2 getSecond() {
        return second;
    }

    /*
        @Brief: This function is used to set the second element of the pair.
        @Param: second - The second element.
        @Return: void - Returns nothing.
     */
    public void setSecond(T2 second) {
        this.second = second;
    }

    /*
        @Brief: This function is used to compare two pairs.
        @Param: obj - The object to compare to.
        @Return: boolean - Returns true if the pairs are equal, false otherwise.
        @Note: Overrides the default equals function due to the need to compare pairs.
     */
    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Pair) {
            Pair<?, ?> pair = (Pair<?, ?>) obj;
            return first.equals(pair.first) && second.equals(pair.second);
        }
        return false;
    }

}

