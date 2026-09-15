
### Coin toss 
Imagine we have two players $A$ and $B$. Player $A$ makes $n+1$ throw and player $B$ only $n$. 
What is the probability that he number of head of player $A$ is greater that the one of player $B$. 

*Solution* : We define the events : 
- $E_1$ : $A$'s n throw have more head than $B$'s n throws 
- $E_2$ : $A$'s n throw have the same number of head than $B$'s n throws 
- $E_3$ : $A$'s n throw have less head than $B$'s throws
Then we see that $P(E_1) = P(E_3) = x$ and we also know that $\sum_i P(E_i) = 1$ 
So we have that $2x+y = 1$ 
But then for $n+1$ throw on the side of player A it don't change the proba of event $E_1$ and $E_3$ but well of event $E_2$ because she increases with a proba $0.5$. So we have $x + 0.5y = 0.5 - 0.5y + 0.5y = 0.5$ 

### Card Game 
We have a deck of card of $52$ cards, the dealer takes a card then you proceed to take a card as well, you loose if you have a inferior or equal card to the one of the dealer. What is the probability of winning ? 

*Solution* : We proceed by counting the number of winning hand.
By considering the extreme case of having a **ace**. We win only if they don't have a ace so there is $48 * 4$ hand were we win in the case of having an **ace**. Then if we proceed to have a **king** then we win for $4 \times 44$ hand and so on so in total we have $$4 \times (48 + 44 + 40 + 36 + 32 + 28 + 24 + 20 + 16+12+8+4)$$ and the total number of hand is $52 \times 51$ so we obtain the total probability. 

### Drunk passenger 

Imagine we have a total of 100 passenger and imagine that the first one is a bit drunk. He then proceed to choose a seat randomly and uniformly. Then the following passenger proceed by going to their respective seat. What is the probability that the seat of the 100 passenger is taken ? 

*Solution* : We can define the two events : 
- $E_1$ = The seat $\#1$ is taken before the seat $\#100$ 
- $E_2$ = The seat $\#100$ is taken before the seat $\#1$ 
In case of $E_1$ we surely going to have our seat but if we are in the case of $E_2$ then we are not going to have our seat. By symmetry we have that the probability of having our seat is $50\%$. To see the symmetry we have that they can't be equal because one seat is taken before the other and so $P(E_1) + P(E_2) = 1$

### N points on a circle 

Here we want to know the probability that $N$ point lie on the same half circle. 

*Solution* 