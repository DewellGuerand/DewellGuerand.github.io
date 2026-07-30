= Project 1 — Sinusoidal Hull-White model

In this project we implemented and verified an extension of the classical and well-known Hull-White model.
The paper suggested that, in order to incorporate the notion of cyclicity into the Hull-White model, the SDE has to be modified so that this periodicity is carried by the $kappa$ term:

$ dif r_t = kappa(t)(theta - r_t) dif t + sigma dif W_t $

$ kappa(t) = kappa_0 + A sin(omega t), quad omega = frac(2pi, 22.5) "rad/yr" $

The authors found such a periodicity through a Fourier analysis of the interest rate series.
In order to verify the results obtained in the article, we retrieved the same data as the one mentioned and plotted the errors of the two models.

We also thought about extending the model further by adding a time-dependent $theta$ term coming directly from the result derived by Nelson-Siegel.

We can see the duality of the predictions of the two models: one is more precise in the short term, whereas the other one is more accurate at long maturities.

= Project 2 — Closed-form pricer for GMAB and GMDB

For this smaller project, we developed a closed form for two insurance products named GMAB and GMDB. These are products that offer a minimum guaranteed accumulation amount regardless of the performance of the underlying.
Here is the complete derivation in detail: we then computed the value of the products using a binomial tree and a Monte Carlo method, after which we studied the convergence of the two methods.

= Project 3 — Disease detection from tabular and image data

This was probably my favourite project by far. The project basically consisted in detecting whether a patient was suffering from a disease, based first on tabular data but also by processing one image per patient. We then proceeded step by step: selecting the relevant features, identifying the ones most correlated with the target, identifying non-linear relations between the variables, and using relevant machine learning models such as XGBoost and Random Forest, but also an MLP.

= Project 4 — Finite element analysis of hexagonal cardboard

Here we implemented, based on the Gmsh library, a finite element analysis in C to answer one question: what would happen if cardboard were made of a hexagonal form instead of the usual corrugated waves?

= Project 5 — Particle filter on the Lorenz attractor

The goal of this project was to estimate the state of a particle following the Lorenz dynamics using only noisy observations of its position. The true trajectory is obtained by integrating the Lorenz system

$ dot(x) = sigma (y - x), quad dot(y) = x (rho - z) - y, quad dot(z) = x y - beta z $

with $sigma = 10$, $rho = 28$ and $beta = 8 slash 3$, and the observations are that trajectory corrupted by a Gaussian noise.

We implemented a SIR (Sequential Importance Resampling) particle filter: the particles are propagated through the dynamics with a fourth-order Runge-Kutta step, then weighted by the likelihood of the current observation, and finally resampled.
We coded three resampling schemes — multinomial, residual and systematic — together with a baseline without any resampling, and we studied how the filter reacts to the process noise, the time step $h$, the number of particles and the observation noise.
The comparison was finally made quantitative by computing the distribution of the RMSE over 50 runs for each resampling method.
