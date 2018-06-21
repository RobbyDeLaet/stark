import { StarkHttpService } from "../services";
import { StarkHttpRequest, StarkSingleItemResponseWrapper, StarkCollectionResponseWrapper } from "../entities";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
/**
 * Mock class of the StarkHttpService interface.
 * @link StarkHttpService
 */
export class MockStarkHttpService implements StarkHttpService<any> {
	/**
	 * Gets the core Angular HTTP API (HttpClient)
	 * @returns Angular Http client
	 */
	public readonly rawHttpClient: HttpClient;

	/**
	 * Executes requests to fetch a single resource
	 * @param request - The HTTP request to be executed
	 * @returns Observable that will emit the single item response wrapper
	 */
	public executeSingleItemRequest: (request: StarkHttpRequest) => Observable<StarkSingleItemResponseWrapper<any>> = jasmine.createSpy(
		"executeSingleItemRequest"
	);

	/**
	 * Executes requests to fetch an array of resources
	 * @param request - The HTTP request to be executed
	 * @returns Observable that will emit the collection response wrapper
	 */
	public executeCollectionRequest: (request: StarkHttpRequest) => Observable<StarkCollectionResponseWrapper<any>> = jasmine.createSpy(
		"executeCollectionRequest"
	);
}
